import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from "cookie-parser";

// Import files
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js'; 
import errorMiddleware from './middleware/errorMiddleware.js';


dotenv.config();

// Connect to MongoDB
connectDB();


const app = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true, // Allows cookies and authentication
        methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
        allowedHeaders: "Content-Type,Authorization"
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", quizRoutes);
app.use("/api/auth", userRoutes);
app.use("/api", uploadRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api", quizRoutes);


app.use(errorMiddleware);


const PORT = process.env.PORT || 4532;

app.listen(PORT, () => {
    console.log(`Node Server Running on Port ${PORT}`);
});
