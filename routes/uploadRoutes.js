import express from "express";
import { upload } from "../middleware/multerMiddleware.js";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
import { uploadAndOcr } from "../middleware/tesseract.js";
import { geminiApi } from "../middleware/geminiMiddleware.js";

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res, next) => {
    console.log("🚀 [STEP 1] Upload Route Triggered");

    if (!req.file) {
        console.log("No file uploaded.");
        return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📁 [STEP 2] Local File Path:", req.file.path);

    const cloudinaryUrl = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryUrl) {
        console.log("Cloudinary upload failed.");
        return res.status(500).json({ error: "Failed to upload to Cloudinary" });
    }

    console.log("[STEP 3] Cloudinary URL:", cloudinaryUrl);
    req.fileUrl = cloudinaryUrl;
    next();
}, uploadAndOcr, geminiApi, (req, res) => {
    console.log("[FINAL] Returning Quiz Data");

    res.json({
        message: "Quiz generated successfully",
        quiz: req.quizData
    });
});

export default router;
