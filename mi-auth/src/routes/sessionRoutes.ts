import express from "express";
import { signin, signout } from "../controller/sessionsController";
const router = express.Router();

router.post("/signin", signin);
router.post("/signout", signout);

export default router;
