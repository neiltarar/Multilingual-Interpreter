import express from "express";
import { uploadVoice } from "../controller/voiceUploadControllers";

const router = express.Router();

router.post("/upload", uploadVoice);

export default router;
