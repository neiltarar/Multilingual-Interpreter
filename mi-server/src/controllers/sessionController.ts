import { Request, Response, Router } from "express";
import { autoInjectable } from "tsyringe";
import { AuthService } from "../services/auth/auth-service";
import { TokenService } from "../services/auth/token-service";
import {
  deleteRefreshToken,
  saveRefreshToken,
  deleteRefreshTokenForUser,
} from "../models/sessionModel";
import { InternalServerError } from "../types/errors/500-errors";
import { BadRequestError } from "../types/errors/400-errors";

@autoInjectable()
export class SessionController {
  private readonly router: Router;
  private readonly authService: AuthService;
  private readonly tokenService: TokenService;

  constructor(authService: AuthService, tokenService: TokenService) {
    this.router = Router();
    this.authService = authService;
    this.tokenService = tokenService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/signin", this.signin.bind(this));
    this.router.post("/signout", this.signout.bind(this));
  }

  public routes(): Router {
    return this.router;
  }

  private async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);

      if (!user) {
        throw new BadRequestError(
          "User not found",
          "User credentials are not valid",
        );
      }

      const userConversations = await this.authService.getUserConversations(
        user.id,
      );

      const payload = {
        userId: user.id,
        name: user.first_name,
        unlimitedReq: user.unlimited_req,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);
      const refreshToken = this.tokenService.generateRefreshToken(payload);

      await deleteRefreshTokenForUser(user.id);
      const result = await saveRefreshToken(user.id, refreshToken);
      if (!result) {
        throw new InternalServerError(
          "Failed to save refresh token",
          "Database error while saving the refresh token in login",
        );
      }

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict", // Added CSRF protection
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict", // Added CSRF protection
        maxAge: 48 * 60 * 60 * 1000, // 48 hours
      });

      res.status(200).json({
        message: "Successful Login",
        user: {
          name: user.first_name,
          userConversations: userConversations,
          apiRights: {
            unlimitedReq: user.unlimited_req,
            totalReqLeft: user.total_req_left,
          },
        },
      });
    } catch (e) {
      if (e instanceof BadRequestError || e instanceof InternalServerError) {
        res.status(400).json({ message: e.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  private async signout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await deleteRefreshToken(refreshToken);
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Successfully logged out" });
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
