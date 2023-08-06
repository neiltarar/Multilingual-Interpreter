import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModels } from "../models/userModel";
import {
	saveRefreshToken,
	deleteRefreshToken,
	deleteRefreshTokenForUser,
} from "../models/sessionModel";

export const signin = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = await userModels.findUserByEmail(email);

	// if user exists and is activated by the admin
	if (user && user.is_activated) {
		const passwordHash = user["password_hash"];

		// if user exists and the password is correct
		if (user && (await bcrypt.compare(password, passwordHash))) {
			// create access token
			const accessToken = jwt.sign(
				{
					userId: user.id,
					name: user.first_name,
					unlimitedReq: user.unlimited_req,
				},
				//@ts-ignore
				process.env.ACCESS_TOKEN_SECRET_KEY,
				{ expiresIn: "10m" }
			);

			// create refresh token
			const refreshToken = jwt.sign(
				{
					userId: user.id,
					name: user.first_name,
					unlimitedReq: user.unlimited_req,
				},
				//@ts-ignore
				process.env.REFRESH_TOKEN_SECRET_KEY,
				{ expiresIn: "48h" }
			);

			// delete any existing previous refresh tokens for the user and create a new one
			await deleteRefreshTokenForUser(user.id);
			const result = await saveRefreshToken(user.id, refreshToken);

			// if new refresh token is saved on db with no issues
			if (result) {
				// set response object, cookies etc
				res.cookie("accessToken", accessToken, {
					httpOnly: true,
					// Force send only on HTTPS
					secure: true,
				});
				res.cookie("refreshToken", refreshToken, {
					httpOnly: true,
					// Force send only on HTTPS
					secure: true,
				});
				res.status(200).json({
					message: "Successful Login",
					user: {
						name: user.first_name,
						apiRights: {
							unlimitedReq: user.unlimited_req,
							totalReqLeft: user.total_req_left,
						},
					},
				});
			} else {
				console.log("Error: Couldn't save the refresh token");
				return res.status(500).json({ message: "Internal Server Error" }); // Add return statement here to prevent further execution
			}
		}
		// if the user exists but not yet activated
	} else if (user && !user.is_activated) {
		const passwordHash = user["password_hash"];
		if (user && (await bcrypt.compare(password, passwordHash))) {
			res.status(400).json({ message: "User is not activated by the admin" });
		} else {
			res.status(400).json({ message: "Unauthorised" });
		}
	} else {
		res.status(400).json({ message: "Unauthorised" });
	}
};

//@ts-ignore
export const signout = async (req, res) => {
	const accessToken = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;
	// If there's a refresh token, delete it from the database
	if (accessToken || refreshToken) {
		try {
			await deleteRefreshToken(refreshToken);
		} catch (error) {
			console.error("Failed to delete refresh token:", error);
			return res.sendStatus(500);
		}
	}

	// Clear the access token and refresh token cookies
	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");
	res.status(200).json({ message: "Successfully logged out" });
};
