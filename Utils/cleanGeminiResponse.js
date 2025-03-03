const cleanGeminiResponse = (responseText) => {
    try {
        if (typeof responseText !== "string") {
            console.error("Invalid input: Expected a string but got", typeof responseText);
            return { "title": "Undefined", "description": "Invalid response format", "questions": [] };
        }

        // Remove json and  markers and trim whitespace
        let cleanedText = responseText.replace(/json|/gs, '').trim();

        // Parse JSON
        let cleanedResponse = JSON.parse(cleanedText);

        console.log("bye", cleanedResponse);

        // Ensure it's a valid object
        if (typeof cleanedResponse === "object" && cleanedResponse !== null) {
            return cleanedResponse;
        }
    } catch (error) {
        console.error("Error parsing Gemini AI Response:", error.message);
    }

    return { "title": "Undefined", "description": "Invalid response from Gemini", "questions": [] };
};

export { cleanGeminiResponse };