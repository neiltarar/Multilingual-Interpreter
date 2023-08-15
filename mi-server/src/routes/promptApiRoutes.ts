import express from "express";
import { voicePromt } from "../controllers/voicePromptControllers";
import { textPrompt } from "../controllers/textPromptControllers";
import { checkUserQuota } from "../middlewares/checkUserQuota";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/prompt-voice", checkUserQuota, upload.none(), voicePromt);
router.post("/prompt-text", checkUserQuota, upload.none(), textPrompt);

export default router;
