import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request } from "express";
import { verifyJWTToken } from "../utils/validateTokens";
import { findRefreshToken } from "../models/sessionModel";
import { CustomRequest } from "../types/dto/auth-types";

dotenv.config();

export const authMiddleware = {
  authenticateToken: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken || !refreshToken) {
      return res.status(401).json({ error: "Unauthorised" });
    }

    try {
      const user = await verifyJWTToken(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY!,
      );
      req.user = user;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        const storedRefreshToken = await findRefreshToken(refreshToken);
        if (!storedRefreshToken) return res.sendStatus(403);

        try {
          const user = await verifyJWTToken(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY!,
          );

          // Create new JWT tokens
          const payload = {
            userId: user.id,
            name: user.first_name,
            unlimitedReq: user.unlimited_req,
          };
          const newAccessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET_KEY!,
            {
              expiresIn: "10m",
            },
          );

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 48 * 60 * 60 * 1000,
          });

          req.user = user;
          next();
        } catch (err) {
          console.error("Refresh token verification error:", err);
          return res
            .status(403)
            .json({ message: "Session expired, please log in again" });
        }
      } else {
        console.error("Access token verification error:", err);
        return res.status(403).redirect("/");
      }
    }
  },
};
