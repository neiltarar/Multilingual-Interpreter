import jwt from "jsonwebtoken";

export class TokenService {
  generateAccessToken(payload: any) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY!, {
      expiresIn: "10m",
    });
  }

  generateRefreshToken(payload: any) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY!, {
      expiresIn: "48h",
    });
  }
}
