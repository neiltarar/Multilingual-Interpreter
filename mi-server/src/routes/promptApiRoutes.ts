import express from "express";
import { uploadVoice } from "../controllers/voiceUploadControllers";
import { textPrompt } from "../controllers/promptUploadControllers";
import { checkUserQuota } from "../middlewares/checkUserQuota";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/upload", checkUserQuota, uploadVoice);
router.post("/prompt-text", checkUserQuota, upload.none(), textPrompt);

export default router;
