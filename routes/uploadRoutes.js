import express from "express";
import { upload } from "../middleware/multerMiddleware.js"; 
import { geminiApi } from "../middleware/geminiMiddleware.js"; 

const router = express.Router();


router.post("/upload", upload.single("file"), geminiApi, (req, res) => {
    res.json(req.quizData); 
});

export default router;