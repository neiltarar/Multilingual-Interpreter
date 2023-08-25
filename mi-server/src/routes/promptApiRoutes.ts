import express from "express";
import { voicePromt } from "../controllers/voicePromptControllers";
import { textPrompt } from "../controllers/textPromptControllers";
import { checkUserQuota } from "../middlewares/checkUserQuota";
import multer from "multer";
import { conversationsControllers } from "../controllers/conversationControllers";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/conversations", conversationsControllers);

router.post(
  "/prompt-voice",
  checkUserQuota,
  upload.single("recordedSound"),
  voicePromt,
);
router.post("/prompt-text", checkUserQuota, upload.none(), textPrompt);

export default router;
