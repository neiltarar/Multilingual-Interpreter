import express from "express";
import cors from "cors";
import "reflect-metadata";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import rateLimit from "express-rate-limit";
import { container } from "tsyringe";
import { UserController } from "./controllers/userController";
import { SessionController } from "./controllers/sessionController";
import { PromptApiController } from "./controllers/promptApiController";

dotenv.config();
const app = express();
app.set("trust proxy", 1);

const PORT = process.env.AUTH_API_PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

// CORS and Rate Limiting
const corsOptions = isProduction
  ? { origin: "https://gpt-helper.duckdns.org", credentials: true }
  : { origin: "http://localhost:3000", credentials: true };

app.use(cors(corsOptions));

if (isProduction) {
  const appLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", appLimiter);
} else {
  console.log("API request limiter is off");
}

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

// Controller Injection
const userController = container.resolve<UserController>(UserController);
const sessionController =
  container.resolve<SessionController>(SessionController);
const promptApiControllerInstance =
  container.resolve<PromptApiController>(PromptApiController);

// Routes
app.use("/users", userController.routes());
app.use("/sessions", sessionController.routes());
app.use("/api", promptApiControllerInstance.routes());

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
