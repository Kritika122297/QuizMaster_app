import mongoose from "mongoose";

const AttemptSchema = new mongoose.Schema(
    {
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required:true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    questions: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz.questions",
            required: true,
          },
          questionText: {
            type: String,
            required: true,
          },
          selectedOption: {
            type: String,
            default: null,
          },
          isCorrect: {
            type: Boolean,
            default: null,
          },
          marks: {
            type: Number,
            default: 0,
          },
          timeTaken: {
            type: Number,
            default: 0,
          },
        },
      ],
      
    score: {
      type: Number,
      required: true,
      default: 0,
    },

    timeTaken: {
        type: Number,
        default: 0,
    },

    },
    {timestamps: true}
);

export default mongoose.model("Attempt", AttemptSchema);