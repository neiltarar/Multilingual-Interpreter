import express from "express";
import { uploadVoice } from "../controller/voiceUploadControllers";
import { uploadPrompt } from "../controller/promptUploadControllers";

const router = express.Router();

router.post("/upload", uploadVoice);
router.post("/prompt", uploadPrompt);

export default router;
