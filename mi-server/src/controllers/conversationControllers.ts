import { Request, Response } from "express";
import { conversationModels } from "../models/conversationsModel";

export const conversationsControllers = async (req: Request, res: Response) => {
  console.log("conversations controller");
  const { conversationId } = req.params;
  let conversation;

  try {
    conversation =
      await conversationModels.findConversationMessagesByConversationId(
        parseInt(conversationId),
      );
  } catch (err) {
    console.error("Error fetching conversation:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  return res.json(conversation);
};
