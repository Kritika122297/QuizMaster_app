
import mongoose from "mongoose";
import Quiz from "../models/quizmodel.js";
import User from "../models/usermodel.js";
import attemptmodel from "../models/attemptmodel.js";

// Create a new quiz
// export const createQuiz = async (req, res) => {
//     const { title, description, questions, totalMarks } = req.body;

//     if (!title || !questions || questions.length === 0 || !totalMarks) {
//         return res.status(400).json({ error: "Title, questions, and totalMarks are required." });
//     }

//     try {
//         const newQuiz = new Quiz({
//             title,
//             description,
//             questions,
//             totalMarks,
//             createdBy: req.user.userId,
//         });

//         await newQuiz.save();
//         res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
//     } catch (error) {
//         res.status(500).json({ error: "Server error while creating quiz" });
//     }
// };


// // Get a single quiz by ID
// export const getQuizById = async (req, res) => {
//     const { quizId } = req.params;

//     try {
//         const quiz = await Quiz.findById(quizId).populate("createdBy", "name email");
//         if (!quiz) {
//             return res.status(404).json({ error: "Quiz not found" });
//         }
//         res.status(200).json(quiz);
//     } catch (error) {
//         res.status(500).json({ error: "Server error while fetching quiz" });
//     }
// };

// // Update a quiz
// export const updateQuiz = async (req, res) => {
//     const { quizId } = req.params;
//     const { title, description, questions, totalMarks } = req.body;

//     try {
//         const quiz = await Quiz.findById(quizId);

//         if (!quiz) {
//             return res.status(404).json({ error: "Quiz not found" });
//         }

//         if (quiz.createdBy.toString() !== req.user.userId) {
//             return res.status(403).json({ error: "You are not authorized to update this quiz" });
//         }

//         if (title) quiz.title = title;
//         if (description) quiz.description = description;
//         if (questions) quiz.questions = questions;
//         if (totalMarks) quiz.totalMarks = totalMarks;

//         await quiz.save();
//         res.status(200).json({ message: "Quiz updated successfully", quiz });
//     } catch (error) {
//         res.status(500).json({ error: "Server error while updating quiz" });
//     }
// };

// // Delete a quiz
// export const deleteQuiz = async (req, res) => {
//     const { quizId } = req.params;

//     try {
//         const quiz = await Quiz.findById(quizId);

//         if (!quiz) {
//             return res.status(404).json({ error: "Quiz not found" });
//         }

//         if (quiz.createdBy.toString() !== req.user.userId && req.user.role !== "admin") {
//             return res.status(403).json({ error: "You are not authorized to delete this quiz" });
//         }

//         await quiz.remove();
//         res.status(200).json({ message: "Quiz deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Server error while deleting quiz" });
//     }
// };

// // Attempt a quiz
// export const attemptQuiz = async (req, res) => {
//     const { quizId } = req.params;
//     const { answers, userId } = req.body;

//     try {
//         // Validate inputs
//         if (!answers || !Array.isArray(answers)) {
//             return res.status(400).json({ error: "Invalid answers format" });
//         }

//         // Find the quiz
//         const quiz = await Quiz.findById(quizId);

//         if (!quiz) {
//             return res.status(404).json({ error: "Quiz not found" });
//         }

//         let correctCount = 0;
//         let attemptedCount = 0;                     

//         // Check the answers
//         const attemptDetails = quiz.questions.map((question, index) => {
//             const userAnswer = answers[index];
//             const correctOption = question.options.find((opt) => opt.correctAnswer);

//             let isCorrect = false;

//             // If the question was answered
//             if (userAnswer !== undefined) {
//                 attemptedCount++;
//                 isCorrect = userAnswer === correctOption.text;
//                 if (isCorrect) correctCount++;
//             }

//             return {
//                 questionText: question.questionText,
//                 selectedOption: userAnswer || null,
//                 isCorrect,
//                 timeTaken: question.timeLimit, // Assuming you track time taken per question
//             };
//         });

//         // Calculate the score
//         const totalQuestions = quiz.questions.length;
//         const scorePerQuestion = quiz.totalMarks / totalQuestions;
//         const totalScore = correctCount * scorePerQuestion;

//         // Update quiz statistics
//         quiz.attempts++;
//         quiz.correctAnswers += correctCount;
//         await quiz.save();

//         // Save the attempt details in the quiz document
//         quiz.attemptsDetails.push({
//             user: userId,
//             score: totalScore,
//             startedAt: new Date(),
//             completedAt: new Date(),
//             questions: attemptDetails,
//         });
//         await quiz.save();

//         res.status(200).json({
//             message: "Quiz attempted successfully",
//             totalQuestions,
//             correctAnswers: correctCount,
//             attempted: attemptedCount,
//             totalQuestions,
//             totalScore,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Server error while attempting quiz" });
//     }
// };

// export const attemptQuestion = async (req,res) => {
//     const{quizId , questionId} = req.params;
//     const selectedOption = req.body;
//     const UserId = req.user.userId;

//     try {
//         const quiz = await Quiz.findById(quizId);

//         if(!quiz){
//             return res.status(404).json({ error: "Quiz not Found."});
//         }

//         const question = quiz.questions.find((q) => {
//             console.log(q._id.toString().trim());  // Ensure no leading/trailing spaces
//             console.log(questionId.trim());        // Ensure no leading/trailing spaces
//             return q._id.toString().trim() === questionId.trim();  // Compare after trimming
//         });
        
//         console.log(questionId);
//         console.log(question);
        
        

//         if(!question){
//             return res.status(404).json({ error: "Question not Found"});
//         }

//         //user's attempt for the quiz
//         let userAttempt = quiz.attemptsDetails.find(
//             (attempt) => attempt.user.toString().trim() === UserId.trim()
//         );
//         console.log(userAttempt);
//         console.log(quiz.attemptsDetails);
        
        
    
        

//         if(!userAttempt){
//             userAttempt = {
//                 user:UserId,
//                 questions: quiz.questions.map((q) => ({
//                     questionId: q._id,
//                     selectedOption: null,
//                     isCorrect: false,
//                 })),
//                 startedAt: new Date(),
//                 completedAt: null,
//                 score: 0,
//             };
//                 quiz.attemptsDetails.push(userAttempt);
//         }

//         //skipping the question
//         if(selectedOption === undefined || selectedOption == null){
//             return res.status(200).json({
//                 message:" question skipped.",
//                 questionId,
//                 selectedOption: null,
//                 isCorrect: null,
//                 currentScore: userAttempt.score,
//             });
//         }

//         if (!mongoose.Types.ObjectId.isValid(questionId)) {
//             return res.status(400).json({ error: "Invalid question ID" });
//         }
        

//         //selected option
//         const correctOption = question.options.find((opt) => opt.correctAnswer);
//         const isCorrect = selectedOption === correctOption.text;

//         let correctCount = 0;
//         let attemptedCount = 0;

//         //update the specific question in the user's attempt
//         const attemptQuestion = userAttempt.questions.find(
//             (q) => q.questionId.tostring() === questionId
//         );

//         console.log("Question ID in attempt:", q.questionId);
//         console.log("Type of question ID:", typeof q.questionId);


//         if(attemptQuestion){
//             if(attemptQuestion.selectedOption == null) {
//                 attemptedCount++;
//             }
//             attemptQuestion.selectedOption = selectedOption;
//             attemptQuestion.isCorrect = isCorrect;
//             if(isCorrect){
//                 correctCount++;
//             }
//         } 
//         //recalculate score
//         const totalQuestions = quiz.questions.length;
//         const scorePerQuestion = quiz.totalMarks / totalQuestions;
//         let total = 0;
//         for (const q of userAttempt.questions) {
//         if (q.selectedOption !== null && q.isCorrect) {
//         total += scorePerQuestion;
//         }
//     }
//     userAttempt.score = totalScore;

//     userAttempt.questions.push({
//         questionId,
//         questionText: question.questionText,
//         selectedOption,
//         isCorrect,
//         timeTaken: null, 
//     });


//     await quiz.save();

//     res.status(200).json({
//         message: "Answer Saved Successfully.",
//         correctAnswer: correctCount,
//         QuestionAtempt: attemptedCount,
//         totalScore: userAttempt.score,
//     });
        
//     } catch (error) {
//         console.error("Error Saving answer:", error),
//         res.status(500).json({error: "Server error while saving answer."});
//     }
// };


//create quiz

export const createQuiz = async (req, res) =>{
    try {
        const {title, description, questions, totalmarks} = req.body;
        const createdBy = req.user.id;

        const quiz = new Quiz({title, description, questions, totalmarks, createdBy});

        await quiz.save();
        res.status(201).json({ message: "Quiz created successfully", quiz});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Failed to create quiz"});
    }
};

//update quiz

export const updateQuiz = async(req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new : true});
        if(!quiz){
            return res.status(404).json({message: "Quiz not Found"});
        }
        if (quiz.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ error: "You are not authorized to update this quiz" });
        }
        res.status(200).json({message: "Quiz updated successfully", quiz});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message})
    }
}

//delete quiz

export const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if(!quiz){
            return res.status(404).json({message: "Quiz not Found"});
        }
        if (quiz.createdBy.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ error: "You are not authorized to delete this quiz" });
        }
        res.status(200).json({message: "Quiz Deleted successfully", quiz});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message})
    }
}

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("createdBy", "name email");
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching quizzes" });
    }
};

//get all quiz

// export const getAllQuizzes_userSpecific = async (req, res) => {
//     try {
//         const quiz = await Quiz.
//     } catch (error) {
        
//     }
// }