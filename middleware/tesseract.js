import tesseract from "tesseract.js";
import pdfPoppler from "pdf-poppler";
import path from "path";
import fs from "fs";

export const uploadAndOcr = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        console.log("OCR Processing File:", filePath);

        let extractedText = "";

        if (req.file.mimetype === "application/pdf") {
            // Convert PDF to Image
            const imageDir = "./public/temp/pdf_images";
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true });
            }

            const imagePath = path.join(imageDir, `${Date.now()}.png`);
            const options = { format: "png", out_dir: imageDir, out_prefix: "pdf_page", page: 1 };

            await pdfPoppler.convert(filePath, options);
            const convertedImages = fs.readdirSync(imageDir).map(file => path.join(imageDir, file));

            // Process each image with OCR
            for (const img of convertedImages) {
                const { data: { text } } = await tesseract.recognize(img, "eng");
                extractedText += text + "\n";
                fs.unlinkSync(img); // Clean up image
            }
        } else {
            // Process Image (JPEG/PNG)
            const { data: { text } } = await tesseract.recognize(filePath, "eng");
            extractedText = text;
        }

        console.log("Extracted OCR Text:", extractedText);

        req.recognizedText = extractedText;
        next();
    } catch (error) {
        console.error("OCR Error:", error);
        res.status(500).json({ error: "Failed to process OCR", details: error.message });
    }
};
