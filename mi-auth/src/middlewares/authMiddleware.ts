import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findRefreshToken } from "../models/sessionModel";

dotenv.config();

//@ts-ignore
export const authenticateToken = async (req, res, next) => {
	const accessToken = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;
	if (accessToken === null) return res.sendStatus(401); // If there's no token, return 401 (Unauthorised)
	jwt.verify(
		accessToken,
		//@ts-ignore
		process.env.ACCESS_TOKEN_SECRET_KEY,
		async (err, user) => {
			if (err) {
				if (err.name === "TokenExpiredError") {
					if (!refreshToken) return res.sendStatus(401);

					// Check if refresh token is valid
					const storedRefreshToken = await findRefreshToken(refreshToken);
					if (!storedRefreshToken) return res.sendStatus(403);
					jwt.verify(
						refreshToken,
						//@ts-ignore
						process.env.REFRESH_TOKEN_SECRET_KEY,
						(err, user) => {
							if (err) {
								console.log("error message for the refresh token: ", err);
								return res
									.status(403)
									.json({ message: "Session expired, please log in again" }); // If refresh token is not valid, return 403 (Forbidden)
							}

							// Generate and send a new access token
							const newAccessToken = jwt.sign(
								//@ts-ignore
								{ userId: user.userId, email: user.email },
								//@ts-ignore
								process.env.ACCESS_TOKEN_SECRET_KEY,
								{ expiresIn: "1m" }
							);
							res.cookie("accessToken", newAccessToken, {
								httpOnly: true,
								// Force send only HTTPS
								secure: true,
							});
							next();
						}
					);
				} else {
					return res.status(403).redirect("/"); // If the token is not valid, return 403 (Forbidden)
				}
			} else {
				req.user = user; // adding the authenticated user's info extracted from the cookie to req
				next();
			}
		}
	);
};
