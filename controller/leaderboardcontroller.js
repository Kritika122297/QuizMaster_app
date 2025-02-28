import mongoose from "mongoose";
import Quiz from "../models/quizmodel.js";
import User from "../models/usermodel.js";
import Leaderboard from '../models/leaderboardmodel.js';

export const submitScore = async (req, res) => {
    try {
        const { username, score } = req.body;
        const { quizId } = req.params; 

        if (!quizId || !username || score === undefined) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }
        const newEntry = new Leaderboard({ quizId, username, score });
        await newEntry.save();

        res.status(201).json({ message: "Score submitted successfully!", entry: newEntry });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTopScores = async (req, res) => {
    try {
        const { quizId } = req.params;
        const topScores = await Leaderboard.find({ quizId })
            .sort({ score: -1, timestamp: 1 })
            .limit(10);

        res.status(200).json(topScores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserBestScore = async (req, res) => {
    try {
        const { quizId, username } = req.params;

        const bestScore = await Leaderboard.findOne({ quizId, username })
            .sort({ score: -1 }) 
            .limit(1);

        if (!bestScore) {
            return res.status(404).json({ message: "No score found for this user in the quiz" });
        }

        res.status(200).json(bestScore);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const { quizId } = req.params; 

        let leaderboard;

        if (quizId) {
            leaderboard = await Leaderboard.find({ quizId })
                .sort({ score: -1, timestamp: 1 });
        } else {
            leaderboard = await Leaderboard.find()
                .sort({ score: -1, timestamp: 1 });
        }

        if (!leaderboard || leaderboard.length === 0) {
            return res.status(404).json({ message: "No leaderboard data found" });
        }

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const resetLeaderboard = async (req, res) => {
    try {
        const { quizId } = req.params;

        await Leaderboard.deleteMany({ quizId });

        res.status(200).json({ message: "Leaderboard reset successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


