import express from "express";
import { createQuiz, getAllQuizzes, getQuizById, updateQuiz, deleteQuiz, attemptQuiz } from "../controller/quizcontroller.js";
import { userAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a quiz
router.post("/create-quiz", userAuth, createQuiz);

// Route to get all quizzes
router.get("/getAllquiz", userAuth, getAllQuizzes);

// Route to get a single quiz by ID
router.get("getQuiz/:quizId", userAuth, getQuizById);

// Route to update a quiz
router.put("update-quiz/:quizId", userAuth, updateQuiz);

// Route to delete a quiz
router.delete("delete-quiz/:quizId", userAuth, deleteQuiz);

// Route to attempt a quiz
router.post("/:quizId/attempt", userAuth, attemptQuiz);

export default router;

