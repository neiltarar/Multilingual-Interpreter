import express from "express";
import { uploadVoice } from "../controller/voiceUploadControllers";
import { textPrompt } from "../controller/promptUploadControllers";
import { checkUserQuota } from "../middlewares/checkUserQuota";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/upload", checkUserQuota, uploadVoice);
router.post("/prompt-text", checkUserQuota, upload.none(), textPrompt);

export default router;
