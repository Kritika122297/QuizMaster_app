import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image"
        });

        console.log("File uploaded to Cloudinary:", response.secure_url);
        fs.unlinkSync(localFilePath); // Delete local temp file
        return response.secure_url;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Ensure temp file is removed even on error
        console.error("❌ Error uploading to Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary };
