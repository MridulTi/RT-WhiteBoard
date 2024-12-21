import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { authRouter } from "./routes/Routes.js";
import { server } from "./socket.js"; // Import the HTTP server from socket.js

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// MongoDB connection
connectDB()
  .then(() => {
    server.on("error", (error) => {
      console.error("ERR: ", error);
      throw error;
    });

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGO DB Connection Failed!", err);
  });

// Define routes
app.get("/", (req, res) => {
  res.send("Hello, this is the root route!");
});

app.use("/api/v1/auth", authRouter);

export default app;
