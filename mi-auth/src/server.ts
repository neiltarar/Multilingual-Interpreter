import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middlewares/authMiddleware";

dotenv.config();

const PORT = process.env.AUTH_API_PORT;

const app = express();
process.env.NODE_ENV === "development"
	? app.use(cors({ origin: "http://localhost:3000", credentials: true }))
	: app.use(cors({ origin: "http://localhost:3001", credentials: true }));

app.use(cookieParser());
app.use(express.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, "build")));

app.use("/users", userRoutes);
app.use("/sessions", sessionRoutes);

app.get("*", authenticateToken, (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`)
);
