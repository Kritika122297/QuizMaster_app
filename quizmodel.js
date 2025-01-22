import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [
        {
          text: { type: String, required: true },
          correctAnswer: { type: Boolean, default: false },
        },
      ],
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium",
      },
      timeLimit: { type: Number, default: 0, min: 0 },
      markForReview: { type: Boolean, default: false },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 1,
  },
  createdAt: { type: Date, default: Date.now },
  attempts: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },

  // Embedded Attempt Data for each user
  attemptsDetails: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      score: {
        type: Number,
        required: true,
        default: 0,
      },
      startedAt: {
        type: Date,
        default: Date.now,
      },
      completedAt: {
        type: Date,
      },
      questions: [
        {
          questionText: { type: String, required: true },
          selectedOption: { type: String, required: true },
          isCorrect: { type: Boolean, required: true },
          timeTaken: { type: Number, required: true },
        },
      ],
    },
  ],
});

const Quiz = mongoose.model("Quiz", QuizSchema);

export default Quiz;
