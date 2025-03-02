const cleanGeminiResponse = (responseText) => {
    let cleanedResponse = responseText.replace(/```.*?```/gs, '').replace(/`/g, '');
    if (cleanedResponse.trim().startsWith("{") && cleanedResponse.trim().endsWith("}")) {
        return cleanedResponse;
    }
    console.error("Invalid Gemini AI Response:", cleanedResponse);
    return '{"title": "Undefined", "description": "Invalid response from Gemini", "questions": []}';
};

export { cleanGeminiResponse };
