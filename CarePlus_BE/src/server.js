import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/configdb";
import authRoutes from "./routes/auth";
import apiRoutes from "./routes/api";
require("dotenv").config();

let app = express();

// CORS — cho phép React client giao tiếp với BE
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", authRoutes);
app.use("/", apiRoutes);

// Global Error Handlers to catch crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('>>> Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('>>> Uncaught Exception thrown:', err);
});

let port = process.env.PORT || 6969;

(async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server chạy tại http://localhost:${port}`);
        });
    } catch (e) {
        process.exit(1);
    }
})();
