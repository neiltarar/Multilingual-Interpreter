import express from "express";
import { signin } from "../controller/sessionsController";
const router = express.Router();

router.post("/signin", signin);

export default router;
