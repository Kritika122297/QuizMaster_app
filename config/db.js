import mongoose from 'mongoose'
import colors from 'colors'
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        if (!process.env.MONGO_URI) {
            throw new Error("MongoDB URI is undefined. Check your .env file.");
        }

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to MongoDB database ${mongoose.connection.host}`.bgMagenta.white)
    } catch (error) {
        console.log(`MongoDB Error ${error}`.bgRed.white)
    }
}

export default connectDB;