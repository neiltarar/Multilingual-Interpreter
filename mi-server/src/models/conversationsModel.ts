import db from "../db/db";

interface createConversationProps {
  user_id: number;
  topic: string;
  created_at?: Date;
}

interface addMessagetoConversationProps {
  conversation_id: number;
  role: string;
  content: string;
  created_at?: Date;
}

export const conversationModels = {
  createNewConversation: async ({
    user_id,
    topic,
    created_at = new Date(),
  }: createConversationProps): Promise<any> => {
    try {
      const result: any[] | undefined = await db(
        "INSERT INTO conversations (user_id, topic, created_at) VALUES ($1, $2, $3) RETURNING id",
        [user_id, topic, created_at],
      );
      return result ? result[0] : null;
    } catch (error: any) {
      console.error("Error creating new conversation:", error);
      throw new Error("Database error when creating new conversation");
    }
  },

  addNewMessageToConversation: async ({
    conversation_id,
    role,
    content,
    created_at = new Date(),
  }: addMessagetoConversationProps): Promise<void> => {
    try {
      await db(
        "INSERT INTO messages (conversation_id, role, content, created_at) VALUES ($1, $2, $3, $4)",
        [conversation_id, role, content, created_at],
      );
    } catch (error: any) {
      console.error("Error adding message to conversation:", error);
      throw new Error("Database error when adding message to conversation");
    }
  },
};
