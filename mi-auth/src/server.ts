import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import voiceApiRoutes from "./routes/voiceApiRoutes";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middlewares/authMiddleware";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.AUTH_API_PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";
const appLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

isProduction
	? app.use(cors({ origin: "https://neil-tarar.com", credentials: true }))
	: app.use(cors({ origin: "http://localhost:3000", credentials: true }));

isProduction
	? app.use("/api/", appLimiter)
	: console.log("API request limiter is off");

app.use(cookieParser());
app.use(express.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, "build")));

// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.use("/users", userRoutes);
app.use("/sessions", sessionRoutes);
// app.use("/api", authenticateToken);
app.use("/api", voiceApiRoutes);
app.get("*", authenticateToken, (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`)
);
