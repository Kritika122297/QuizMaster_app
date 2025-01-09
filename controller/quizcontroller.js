import Quiz from "../models/quizmodel.js";

// Create a new quiz
export const createQuiz = async (req, res) => {
    const { title, description, questions, totalMarks } = req.body;

    if (!title || !questions || questions.length === 0 || !totalMarks) {
        return res.status(400).json({ error: "Title, questions, and totalMarks are required." });
    }

    try {
        const newQuiz = new Quiz({
            title,
            description,
            questions,
            totalMarks,
            createdBy: req.user.userId,
        });

        await newQuiz.save();
        res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
    } catch (error) {
        res.status(500).json({ error: "Server error while creating quiz" });
    }
};

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("createdBy", "name email");
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching quizzes" });
    }
};

// Get a single quiz by ID
export const getQuizById = async (req, res) => {
    const { quizId } = req.params;

    try {
        const quiz = await Quiz.findById(quizId).populate("createdBy", "name email");
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching quiz" });
    }
};

// Update a quiz
export const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { title, description, questions, totalMarks } = req.body;

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        if (quiz.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ error: "You are not authorized to update this quiz" });
        }

        if (title) quiz.title = title;
        if (description) quiz.description = description;
        if (questions) quiz.questions = questions;
        if (totalMarks) quiz.totalMarks = totalMarks;

        await quiz.save();
        res.status(200).json({ message: "Quiz updated successfully", quiz });
    } catch (error) {
        res.status(500).json({ error: "Server error while updating quiz" });
    }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        if (quiz.createdBy.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ error: "You are not authorized to delete this quiz" });
        }

        await quiz.remove();
        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error while deleting quiz" });
    }
};

// Attempt a quiz
export const attemptQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { answers, userId } = req.body;

    try {
        // Validate inputs
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: "Invalid answers format" });
        }

        // Find the quiz
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        if (quiz.questions.length !== answers.length) {
            return res.status(400).json({
                error: "Number of answers does not match the number of questions in the quiz",
            });
        }

        let correctCount = 0;

        // Check the answers
        const attemptDetails = quiz.questions.map((question, index) => {
            const userAnswer = answers[index];
            const correctOption = question.options.find((opt) => opt.correctAnswer);

            // Compare the user's answer with the correct option
            const isCorrect = userAnswer === correctOption.text;
            if (isCorrect) correctCount++;

            return {
                questionText: question.questionText,
                selectedOption: userAnswer,
                isCorrect,
                timeTaken: question.timeLimit, // Assuming you track time taken per question
            };
        });

        // Update quiz statistics
        quiz.attempts++;
        quiz.correctAnswers += correctCount;
        await quiz.save();

        // Save the attempt details in the quiz document
        quiz.attemptsDetails.push({
            user: userId,
            score: correctCount,
            startedAt: new Date(),
            completedAt: new Date(),
            questions: attemptDetails,
        });
        await quiz.save();

        res.status(200).json({
            message: "Quiz attempted successfully",
            correctAnswers: correctCount,
            totalQuestions: quiz.questions.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while attempting quiz" });
    }
};
