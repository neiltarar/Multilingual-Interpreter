import express from "express";
import { conversationsControllers } from "../controllers/conversationControllers";

const router = express.Router();

router.get("/:conversationId", conversationsControllers);
