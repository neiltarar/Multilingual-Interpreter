import { autoInjectable } from "tsyringe";
import bcrypt from "bcrypt";
import { BadRequestError } from "../../types/errors/400-errors";
import { userModels } from "../../models/userModel";
import { ConversationService } from "../conversation/conversation-service";

@autoInjectable()
export class AuthService {
  constructor(private conversationService?: ConversationService) {}

  async login(email: string, password: string) {
    const user = await userModels.findUserByEmail(email);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new BadRequestError("Invalid password");
    }

    if (!user.is_activated) {
      throw new BadRequestError("User is not activated by the admin");
    }

    return user;
  }
}
