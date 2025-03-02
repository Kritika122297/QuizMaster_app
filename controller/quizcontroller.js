
import mongoose from "mongoose";
import Quiz from "../models/quizmodel.js";
import User from "../models/usermodel.js";

export const createQuiz = async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        const createdBy = req.user.id; 
        if (!title || !questions || questions.length === 0 || !createdBy) {
            return res.status(400).json({ 
                success: false, 
                message: "Title, questions, and createdBy are required!" 
            });
        }
        const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
        const quiz = new Quiz({ title, description, questions, totalMarks, createdBy });

        await quiz.save();
        res.status(201).json({ 
            success: true, 
            message: "Quiz created successfully!", 
            quiz 
        });

    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ success: false, message: "Failed to create quiz", error: error.message });
    }
};



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
};



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
};

export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("createdBy");
        if (!quizzes.length) {
            return res.status(404).json({ message: "No quizzes found" });
        }
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching quizzes" });
    }
};

export const getQuizzesByUser = async (req, res) => {
    try {
        const UserId = req.user._id; 
        const quizzes = await Quiz.find({ createdBy: UserId }).populate("createdBy");
        if (!User)
            return res.status(404).json({ message: "User  not found" });
        if (!quizzes || quizzes.length === 0)
            return res.status(404).json({ message: "No quizzes found for this user" });
        res.status(200).json({ quizzes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getQuizById = async (req, res) => {
    const { quizId } = req.params;

    try {
        const quiz = await Quiz.findById(quizId).populate("createdBy");
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching quiz" });
    }
};

export const getAllPublicQuizzes = async (req, res)=>{
    try {
        const quizzes = await Quiz.find({Public: true}).populate('questions');
        if(!quizzes || quizzes.length === 0)
            res.status(404).json({message: "No public quizzes found"})
        res.status(200).json({quizzes})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

//attempts
// export const createAttempt = async (req, res) => {
//     try {
//         const { quizId } = req.params;  
//         const userId = req.user._id;  

        
//         const quiz = await Quiz.findById(quizId);
//         if (!quiz) return res.status(404).json({ message: "Quiz not found" });


// const uploadQuiz = async (req, res)=>{
//     try {
//         const {quiz} = req
//         if(!quiz || !quiz.title || !quiz.questions)
//             return res.status(400).json({message: "Invalid quiz data"})
//         const newQuiz = new Quiz({
//             title: quiz.title,
//             description: quiz.description || '',
//             questions: quiz.questions.map(question => ({
//                 questionNumber: question.questionNumber,
//                 question: question.question,
//                 options: question.options,
//                 answer: question.answer || 'a',
//                 marks: 1 // Default marks for each question
//             })),
//             time: 240, // Default time
//             difficultyLevel: "Easy", // Default difficulty level
//             attemptedBy: []
//         })
//         const savedQuiz = await newQuiz.save()
//         const user = await User.findById(req.user._id)
//         if(!user)
//             return res.status(404).json({error: 'user not found'})
//         user.quizzesCreated.push(savedQuiz._id.toString())
//         await user.save()
//         res.status(200).json({message: "Quiz uploaded successfully"})
//     } catch (error) {
//         res.status(500).json({error: error.message})
//     }
// }
export const uploadQuiz = async (req, res)=>{
    try {
        const {quiz} = req
        if(!quiz || !quiz.title || !quiz.questions)
            return res.status(400).json({message: "Invalid quiz data"})
        const newQuiz = new Quiz({
            title: quiz.title,
            description: quiz.description || '',
            questions: quiz.questions.map(question => ({
                questionNumber: question.questionNumber,
                question: question.question,
                options: question.options,
                answer: question.answer || 'a',
                marks: 1 // Default marks for each question
            })),
            time: 240, // Default time
            difficultyLevel: "Easy", // Default difficulty level
            attemptedBy: []
        })
        const savedQuiz = await newQuiz.save()
        const user = await User.findById(req.user._id)
        if(!user)
            return res.status(404).json({error: 'user not found'})
        user.quizzesCreated.push(savedQuiz._id.toString())
        await user.save()
        res.status(200).json({message: "Quiz uploaded successfully"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


export const attemptQuestion = async (req, res) => {
    try {
        const { selectedOption } = req.body;
        const { quizId, questionId } = req.params; 

        if (!selectedOption) {
            return res.status(400).json({ error: "Selected option is required" });
        }
        const attempt = await attempt.findOne({ quiz: quizId, user: req.user._id }).populate('quiz');
        //find question by Id
        const question = attempt.quiz.questions.find(q => q._id.toString() === questionId);
        if (!question) return res.status(404).json({ error: "Question not found" });
        
        const isCorrect = question.options.some(option => option.isCorrect && option.optionText === selectedOption);

        const Findquestion = attempt.questions.find(q => q.questionId.toString() === questionId);
        if (Findquestion) {
            question.selectedOption = selectedOption;
            question.isCorrect = isCorrect;
            question.marks = isCorrect ? question.marks : 0;
        }

        let totalScore = 0;
        attempt.questions.forEach(q => totalScore += q.marks);
        attempt.score = totalScore;

        await attempt.save();

        res.status(200).json({ message: 'Question answered', score: attempt.score });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

export const attempQuiz = async (req, res) => {
    try {
        const { answers } = req.body;
        const { quizId } = req.params; 
        if (!Array.isArray(answers)) {
            return res.status(400).json({ error: "Answers array is required" });
        }

        const attempts = await attempts.findOne({ quiz: quizId, user: req.user._id }).populate('quiz');
        if (!attempts) return res.status(404).json({ error: "Quiz attempt not found" });

        let totalScore = 0;

    attempts.questions = attempts.quiz.questions.map((question, i) => {
        const selectedOption = answers[i];
        const isCorrect = question.options.some(option => option.isCorrect && option.optionText === selectedOption);
        const marks = isCorrect ? question.marks : 0;

        totalScore += marks;
        return { selectedOption, isCorrect, marks };
    });
        attempts.totalScore = totalScore;
        await attempts.save();
        res.status(200).json({ message: 'Question answered', score: attempts.score });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

export const reviewAttempts = (req, res) => {
    try {
        const { userId } = req.params;
        const attempts = attempts(userId);

        if (!attempts.length) {
            return res.status(404).json({ message: "No attempts found" });
        }

        res.json({ attempts });
    } catch (error) {
        console.error("Error fetching attempts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
