import mongoose from "mongoose";

// Schema for Quiz Model
const QuizSchema = new mongoose.Schema({
  // Title of the Quiz
  title: {
    type: String,
    required: true,
  },

  // Description of the Quiz
  description: {
    type: String,
  },

  // Array of Questions
  questions: [
    {
      // The text or prompt of the question
      questionText: {
        type: String,
        required: true,
      },

      // Answer options for the question
      options: [
        {
          // Text of the option
          text: {
            type: String,
            required: true,
          },
          // Indicates if this option is the correct answer
          correctAnswer: {
            type: Boolean,
            default: false,
          },
        },
      ],

      // Difficulty level of the question
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"], // Restrict values to specific strings
        default: "medium",
      },

      // Time limit for answering the question (in seconds)
      timeLimit: {
        type: Number,
        default: 0, // No time limit if not specified
        min: 0,
      },

      // Flag to indicate if the question is marked for review
      markForReview: {
        type: Boolean,
        default: false,
      },
    },
  ],

  // User who created the quiz (linked to the User model)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },

  // Total marks for the quiz
  totalMarks: {
    type: Number,
    required: true,
    min: 1, // Total marks must be at least 1
  },

  // Metadata: When the quiz was created
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Statistics: Total number of attempts made on this quiz
  attempts: {
    type: Number,
    default: 0,
  },

  // Statistics: Total number of correct answers across all attempts
  correctAnswers: {
    type: Number,
    default: 0,
  },

  // Embedded array to track attempt details for each user
  attemptsDetails: [
    {
      // The user who attempted the quiz
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      // The score achieved by the user
      score: {
        type: Number,
        required: true,
        default: 0,
      },

      // Timestamp when the attempt started
      startedAt: {
        type: Date,
        default: Date.now,
      },

      // Timestamp when the attempt was completed
      completedAt: {
        type: Date,
      },

      // Per-question details for the attempt
      questions: [
        {
          // The text of the question
          questionText: {
            type: String,
            required: true,
          },
          // The option selected by the user
          selectedOption: {
            type: String,
            required: true,
          },
          // Whether the user's answer was correct
          isCorrect: {
            type: Boolean,
            required: true,
          },
          // Time taken by the user to answer the question (in seconds)
          timeTaken: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});

// Create a Mongoose model from the schema
const Quiz = mongoose.model("Quiz", QuizSchema);

export default Quiz;
