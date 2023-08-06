import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findRefreshToken } from "../models/sessionModel";
import { Request, Response, NextFunction } from "express";
dotenv.config();

interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	password_hash: string;
	is_activated: boolean;
	unlimited_req: boolean;
	total_req_left: number;
}

export const authenticateToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const accessToken = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;
	if (accessToken === null) return res.sendStatus(401); // If there's no token, return 401 (Unauthorised)

	//@ts-ignore
	const verifyToken = (token, secret) =>
		new Promise((resolve, reject) => {
			//@ts-ignore
			jwt.verify(token, secret, (err, userData) => {
				if (err) {
					reject(err);
				} else {
					resolve(userData as User);
				}
			});
		});

	try {
		const user = await verifyToken(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET_KEY
		);
		//@ts-ignore
		req.user = user;
		next();
	} catch (err) {
		if ((err as jwt.TokenExpiredError).name === "TokenExpiredError") {
			if (!refreshToken) return res.sendStatus(401);

			const storedRefreshToken = await findRefreshToken(refreshToken);
			if (!storedRefreshToken) return res.sendStatus(403);

			try {
				const user = await verifyToken(
					refreshToken,
					process.env.REFRESH_TOKEN_SECRET_KEY
				);

				const newAccessToken = jwt.sign(
					{
						//@ts-ignore
						userId: user.userId,
						//@ts-ignore
						name: user.name,
						//@ts-ignore
						unlimitedReq: user.unlimitedReq,
					},
					process.env.ACCESS_TOKEN_SECRET_KEY as string,
					{ expiresIn: "10m" }
				);

				res.cookie("accessToken", newAccessToken, {
					httpOnly: true,
					secure: true,
				});
				//@ts-ignore
				req.user = user; // add the user to req object after generating new access token
				//@ts-ignore
				next();
			} catch (err) {
				console.log("error message for the refresh token: ", err);
				return res
					.status(403)
					.json({ message: "Session expired, please log in again" });
			}
		} else {
			return res.status(403).redirect("/");
		}
	}
};
