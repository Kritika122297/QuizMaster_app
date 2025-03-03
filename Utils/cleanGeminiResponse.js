const cleanGeminiResponse = (responseText) => {
    try {
        if (typeof responseText !== "string") {
            console.error("Invalid input: Expected a string but got", typeof responseText);
            return { "title": "Undefined", "description": "Invalid response format", "questions": [] };
        }

        // Remove markdown formatting (` ```json ` or ` ``` `) at the start and end
        let cleanedText = responseText.replace(/^```(json)?\n?|```$/g, "").trim();

        // Try to extract only the JSON part (fix unexpected trailing characters)
        let firstCurlyIndex = cleanedText.indexOf("{");
        let lastCurlyIndex = cleanedText.lastIndexOf("}");
        
        if (firstCurlyIndex === -1 || lastCurlyIndex === -1) {
            throw new Error("No valid JSON object found in response");
        }

        cleanedText = cleanedText.substring(firstCurlyIndex, lastCurlyIndex + 1);

        // Parse JSON
        let cleanedResponse = JSON.parse(cleanedText);

        console.log("bye", cleanedResponse);

        // Ensure valid JSON object
        if (typeof cleanedResponse === "object" && cleanedResponse !== null) {
            return cleanedResponse;
        }
    } catch (error) {
        console.error("Error parsing Gemini AI Response:", error.message);
    }

    return { "title": "Undefined", "description": "Invalid response from Gemini", "questions": [] };
};

export { cleanGeminiResponse };
