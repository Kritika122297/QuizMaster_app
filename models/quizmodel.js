import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
  },

  questions: [
    {
      
      questionText: {
        type: String,
        required: true,
      },

      options: [
        {
          type: String,
          required: true,
        },
      ],

      answer: {
        type: String,
        required: true
      },

      marks: {
        type: Number,
        required: true
      },

      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"], 
        default: "medium",
      },

      timeLimit: {
        type: Number,
        default: 0, 
        min: 0,
      },
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

},
  { timestamps: true }

);


export default mongoose.model("Quiz", QuizSchema);


