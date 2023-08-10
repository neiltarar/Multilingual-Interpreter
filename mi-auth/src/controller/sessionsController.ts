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
	let user;

	try {
		user = await userModels.findUserByEmail(email);
	} catch (err) {
		console.error("Error fetching user:", err);
		return res.status(500).json({ message: "Internal Server Error" });
	}

	// Check if user exists
	if (!user) {
		return res.status(401).json({ message: "Unauthorised" });
	}

	// Check if user is activated by the admin
	if (!user.is_activated) {
		// No need to check password for not activated users
		return res
			.status(401)
			.json({ message: "User is not activated by the admin" });
	}

	// Check if the password is correct
	const isPasswordValid = await bcrypt.compare(password, user.password_hash);
	if (!isPasswordValid) {
		return res.status(401).json({ message: "Unauthorised" });
	}

	// Create JWT tokens
	const payload = {
		userId: user.id,
		name: user.first_name,
		unlimitedReq: user.unlimited_req,
	};

	const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY!, {
		expiresIn: "10m",
	});

	const refreshToken = jwt.sign(
		payload,
		process.env.REFRESH_TOKEN_SECRET_KEY!,
		{ expiresIn: "48h" }
	);

	// Delete any existing previous refresh tokens for the user and create a new one
	await deleteRefreshTokenForUser(user.id);
	const result = await saveRefreshToken(user.id, refreshToken);

	// Handle possible error in token saving
	if (!result) {
		console.error("Error: Couldn't save the refresh token");
		return res.status(500).json({ message: "Internal Server Error" });
	}

	// Set cookies and respond
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict", // Added CSRF protection
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict", // Added CSRF protection
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
};

export const signout = async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken;

	// If there's a refresh token, delete it from the database
	if (refreshToken) {
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
