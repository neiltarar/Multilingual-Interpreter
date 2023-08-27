import axios from "axios";
import { conversationModels } from "../../models/conversationsModel";
import { userModels } from "../../models/userModel";
import { ConversationService } from "../conversation/conversation-service";
import { NotFoundError } from "../../types/errors/400-errors";
import { transformHistoryForGPT } from "../../utils/transformHistoryForGPT";

const CHAT_GPT_API_KEY = process.env.CHAT_GPT_API_KEY;

// Fail gracefully if api key cannot be found
if (!CHAT_GPT_API_KEY) {
  throw new Error("CHAT_GPT_API_KEY environment variable not set!");
}

export class GPTService {
  // Define types for class properties
  isUnlimitedRequest: boolean;
  totalApiRequestsLeft: number;
  userId: number | null;
  userName: string;
  promptText: string;
  feature: string;
  sourceLanguage: string;
  targetLanguage: string;
  gptResponse: string;
  header: Record<string, string>;
  gptTranslateData: Record<string, any>;
  gptHelperData: (messages?) => {};
  imageGeneratorData: Record<string, any>;
  isFirstRequest: boolean;
  conversationId: number | null;
  conversationService: ConversationService;

  constructor(
    isUnlimitedRequest: boolean = false,
    totalApiRequestsLeft: number = 0,
    userName: string,
    userId: number | null = null,
    promptText: string = "test",
    feature: string = "gpthelper",
    sourceLanguage: string = "english",
    targetLanguage: string = "turkish",
    isFirstRequest: string = "true",
    conversationId: number | null = null,
  ) {
    this.isUnlimitedRequest = isUnlimitedRequest;
    this.totalApiRequestsLeft = totalApiRequestsLeft;
    this.userId = userId;
    this.userName = userName;
    this.promptText = promptText;
    this.feature = feature;
    this.sourceLanguage = sourceLanguage;
    this.targetLanguage = targetLanguage;
    this.gptResponse = "";
    this.isFirstRequest = isFirstRequest === "true" ? true : false;
    this.conversationId = conversationId;
    this.conversationService = new ConversationService();

    this.header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHAT_GPT_API_KEY}`,
    };

    this.gptTranslateData = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful multilingual translator. You always try to translate from source to target languages by trying to stay true to the meaning, culture and its context.",
        },
        {
          role: "user",
          content: `Translate the following from source:${this.sourceLanguage} into target:${this.targetLanguage}: '${this.promptText}'`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    this.gptHelperData = (
      messages = [
        {
          role: "system",
          content:
            "You are a helpful assistant, who is polite and asks for further information when needed to help better.",
        },
        { role: "user", content: `${this.promptText}` },
      ],
    ) => {
      return {
        model: "gpt-4",
        messages: messages,
        temperature: 0.3,
        max_tokens: 2000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      };
    };

    this.imageGeneratorData = {
      prompt: this.promptText,
      n: 1,
      size: "256x256",
    };
  }

  async #setResponseObject() {
    //@ts-ignore
    const userConversationHistory =
      await this.conversationService.getConversationsByUserId(this.userId);
    if (this.isUnlimitedRequest) {
      return {
        user: {
          name: this.userName,
          userConversations: userConversationHistory,
          apiRights: {
            unlimitedReq: this.isUnlimitedRequest,
            totalReqLeft: this.totalApiRequestsLeft,
          },
        },
        message: this.gptResponse,
      };
    } else {
      return {
        user: {
          name: this.userName,
          usersConversations: userConversationHistory,
          apiRights: {
            unlimitedReq: this.isUnlimitedRequest,
            totalReqLeft: this.totalApiRequestsLeft,
          },
        },
        message: this.gptResponse,
      };
    }
  }

  async translate(): Promise<string | any> {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        this.gptTranslateData,
        { headers: this.header },
      );
      this.gptResponse = response.data.choices[0].message.content.trim();
      return this.#setResponseObject();
    } catch (error) {
      console.error("Error:", error);
      throw new Error("An error occurred; contact the admin");
    }
  }

  async gptHelper(): Promise<string | any> {
    if (this.isFirstRequest && this.userId) {
      const topic: string = this.promptText.split(" ").slice(0, 6).join(" ");
      try {
        const { id: conversationId } =
          await conversationModels.createNewConversation({
            user_id: this.userId,
            topic,
          });

        await conversationModels.addNewMessageToConversation({
          conversation_id: conversationId,
          role: "user",
          content: this.promptText,
        });
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          this.gptHelperData(),
          { headers: this.header },
        );

        this.gptResponse = response.data.choices[0].message.content.trim();
        await conversationModels.addNewMessageToConversation({
          conversation_id: conversationId,
          role: "system",
          content: this.gptResponse,
        });

        return this.#setResponseObject();
      } catch (error) {
        console.error("Error:", error);
        throw new Error("An error occurred; contact the admin");
      }
    } else if (this.userId) {
      if (this.conversationId) {
        const conversationIdNum = parseInt(this.conversationId.toString(), 10);
        const conversationMessages =
          await this.conversationService.getMessagesByConversationId(
            conversationIdNum,
          );

        const messages = transformHistoryForGPT(
          conversationMessages,
          this.promptText,
        );

        await conversationModels.addNewMessageToConversation({
          conversation_id: conversationIdNum,
          role: "user",
          content: this.promptText,
        });
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          this.gptHelperData(messages),
          { headers: this.header },
        );

        this.gptResponse = response.data.choices[0].message.content.trim();
        await conversationModels.addNewMessageToConversation({
          conversation_id: conversationIdNum,
          role: "system",
          content: this.gptResponse,
        });

        return this.#setResponseObject();
      } else {
        throw new NotFoundError(
          "Conversation not found",
          "Conversation id was faulty",
        );
      }
    }
  }

  async imageGenerator(): Promise<string | any> {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        this.imageGeneratorData,
        { headers: this.header },
      );
      this.gptResponse = response.data.data[0]["url"];
      return this.#setResponseObject();
    } catch (error) {
      console.error("Error:", error);
      throw new Error("An error occurred; contact the admin");
    }
  }

  async sendNoApiTokenMessage(): Promise<string | any> {
    return this.#setResponseObject();
  }
}
