import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { userModels } from "../models/userModel";
import { isMatchingPasswords, isValidEmail } from "../utils/validators";
import { UserDto } from "../types/dto/UserDto";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserController {
  private readonly router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/signup", this.signup.bind(this) as any);
    // Add other user-related routes here like login, profile, etc.
  }

  public routes(): Router {
    return this.router;
  }

  private async signup(req: Request, res: Response): Promise<void> {
    try {
      const user: UserDto = req.body;
      const { firstName, lastName, email, password, passwordRepeat } = user;
      let errors = [];

      if (!isValidEmail(email)) {
        errors.push("Email is not valid");
      }
      if (!isMatchingPasswords(password, passwordRepeat)) {
        errors.push("Passwords do not match");
      }

      if (errors.length > 0) {
        res.status(400).json({ message: errors.join(", ") });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 11);
      const result = await userModels.createNewUser({
        firstName,
        lastName,
        email,
        passwordHash,
      });

      if (!result) {
        res.status(409).json({ message: "User already exists" });
        return;
      }

      res.status(200).json({
        message: "Successfully created a user.",
        // @ts-ignore
        email: result[0]["email"],
      });
    } catch (error) {
      console.error("An error occurred during user creation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
