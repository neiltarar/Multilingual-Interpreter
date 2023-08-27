import { autoInjectable } from "tsyringe";
import db from "../../db/db";

@autoInjectable()
export class ConversationService {
  async getConversationsByUserId(userId: number) {
    try {
      const conversations = await db(
        "SELECT * FROM conversations WHERE user_id = $1",
        [userId],
      );
      return conversations;
    } catch (error) {
      console.error("Error fetching user conversations:", error);
      throw new Error("Database error when fetching user conversations");
    }
  }

  async getMessagesByConversationId(conversationId: number) {
    try {
      const messages = await db(
        "SELECT * FROM messages WHERE conversation_id = $1",
        [conversationId],
      );
      return messages;
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
      throw new Error("Database error when fetching conversation messages");
    }
  }
}
