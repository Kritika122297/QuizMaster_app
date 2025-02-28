import {GoogleGenerativeAI} from '@google/generative-ai'
import { cleanGeminiResponse } from '../Utils/cleanGeminiResponse.js'

const geminiApi = async (req, res, next)=>{
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})
        const prompt =`You are an AI that generates JSON-formatted academic question banks. Your task is to take the provided input text and transform it into a structured JSON format. Follow this template:
        {
          "title": "<Title of the question bank>",
          "description": "<Brief description of the question bank>",
          "questions": [
            {
              "questionNumber": "<Sequential number for each question>",
              "question": "<The question text>",
              "options": [
                "<Option 1>",
                "<Option 2>",
                "<Option 3>",
                "<Option 4>"
              ],
              "answer": "<The correct answer, or an empty string if unknown>"
            }
          ]
        }
        
        Now, based on the following input text, generate a valid JSON object that strictly follows the above structure:
        '${req.recognizedText}'
        Ensure the response is a correctly formatted JSON object, beginning with '{' and ending with '}' without additional text.`;
        
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        const cleanedResponse = cleanGeminiResponse(responseText);
        
        try {
            req.quizData = JSON.parse(cleanedResponse);
            next();
        } catch (jsonError) {
            return res.status(500).json({ error: 'Failed to parse generated JSON', details: jsonError.message });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

export { geminiApi };
