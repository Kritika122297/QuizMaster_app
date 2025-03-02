
// authMiddleware.js
import JWT from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    console.log("Auth Header Received:", authHeader);
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        token = authHeader.split(" ")[1];
    } 
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ error: "Authorization token is missing or invalid" });
    }

    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Authentication Failed: Invalid or expired token" });
    }
};
