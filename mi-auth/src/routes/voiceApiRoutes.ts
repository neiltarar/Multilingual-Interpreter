import express from "express";
import { uploadVoice } from "../controller/voiceUploadControllers";
import { uploadPrompt } from "../controller/promptUploadControllers";
import { checkUserQuota } from "../middlewares/checkUserQuota";

const router = express.Router();

router.post("/upload", checkUserQuota, uploadVoice);
router.post("/prompt", checkUserQuota, uploadPrompt);

export default router;
