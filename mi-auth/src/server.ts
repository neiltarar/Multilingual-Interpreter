import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.AUTH_API_PORT;

app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`)
);

app.use("/users", userRoutes);
