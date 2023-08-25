import { Request, Response, Router } from "express";
import { autoInjectable } from "tsyringe";
import { GPTService } from "../services/gptService/GPTService";
import { InvalidPromptError } from "../types/errors/400-errors";
import multer from "multer";
import { checkUserQuota } from "../middlewares/checkUserQuota";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CustomRequest } from "../types/dto/auth-types";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

@autoInjectable()
export class PromptApiController {
  private readonly router: Router;
  private readonly gptService: GPTService;

  constructor(gptService: GPTService) {
    this.router = Router();
    this.gptService = gptService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/conversations", this.conversations.bind(this));
    this.router.post(
      "/prompt-voice",
      authMiddleware.authenticateToken as any,
      checkUserQuota,
      upload.single("recordedSound"),
      this.voicePrompt.bind(this),
    );
    this.router.post(
      "/prompt-text",
      authMiddleware.authenticateToken as any,
      checkUserQuota,
      upload.none(),
      this.textPrompt.bind(this),
    );
  }

  public routes(): Router {
    return this.router;
  }

  private async conversations(req: Request, res: Response) {
    try {
      // Implement the functionality for conversations
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  private async voicePrompt(req: Request, res: Response) {
    try {
      // Implement the functionality for voicePrompt
    } catch (e) {
      if (e instanceof InvalidPromptError) {
        res.status(400).json({ message: e.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  private async textPrompt(req: CustomRequest, res: Response) {
    // Validate the user object
    if (!req.user) {
      console.error("User object is not correctly set.");
      return res.status(500).send({
        message: "User object is not correctly set.",
      });
    }
    try {
      const {
        selectedLanguage,
        selectedLanguage2,
        selectedFeature,
        promptInput,
      } = req.body;

      const { name: userName, userId, unlimitedReq } = req.user;
      let Conversation;

      if (!unlimitedReq) {
        Conversation = new GPTService(
          unlimitedReq,
          req.user.total_req_left,
          userName,
          promptInput,
          selectedFeature,
          selectedLanguage,
          selectedLanguage2,
        );
      } else {
        Conversation = new GPTService(
          unlimitedReq,
          req.user.total_req_left,
          userName,
          userId,
          promptInput,
          selectedFeature,
          selectedLanguage,
          selectedLanguage2,
        );
      }

      switch (selectedFeature.toLowerCase()) {
        case "gpthelper":
          Conversation.gptHelper().then((response) => res.json(response));
          break;
        case "translate":
          Conversation.translate().then((response) => res.json(response));
          break;
        case "imagegenerator":
          Conversation.imageGenerator().then((response) => res.json(response));
          break;
        case "transcribe":
          let responseData = {
            user: {
              name: userName,
              apiRights: {
                unlimitedReq: unlimitedReq,
                totalReqLeft: req.user.total_req_left
                  ? req.user.total_req_left
                  : 0,
              },
            },
            message: "Transcription Feature is for speech only.",
          };

          res.json(responseData);
          break;
        default:
          res.json({
            message: "Couldn't understand what you asked for",
          });
          break;
      }
    } catch (e) {
      if (e instanceof InvalidPromptError) {
        res.status(400).json({ message: e.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}
