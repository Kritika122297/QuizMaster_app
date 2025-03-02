import tesseract from "tesseract.js";

export const uploadAndOcr = async (req, res, next) => {
    try {
        if (!req.fileUrl) {
            return res.status(400).json({ error: "File URL not found for OCR processing" });
        }

        console.log("OCR Processing File:", req.fileUrl);

        const { data: { text } } = await tesseract.recognize(req.fileUrl, "eng");

        console.log("Extracted OCR Text:", text);

        req.recognizedText = text;
        next();
    } catch (error) {
        console.error("OCR Error:", error);
        res.status(500).json({ error: "Failed to process OCR", details: error.message });
    }
};
