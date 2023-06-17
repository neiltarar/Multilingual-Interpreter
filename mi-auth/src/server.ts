import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import path from "path";
import { authenticateToken } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.AUTH_API_PORT;

app.use(express.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, "build")));

app.use("/users", userRoutes);

app.get("/home", authenticateToken, (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`)
);
