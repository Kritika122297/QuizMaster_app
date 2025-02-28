

const errorMiddleware = (err, req, res, next) => {
    console.log("Error:", err);
    
    let statusCode = 500;
    let message = err.message || "Something went wrong";

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(item => item.message).join(", ");
    }

    // Prevent multiple responses
    if (res.headersSent) {
        return next(err);
    }
    return res.status(statusCode).json({
        success: false,
        message
    });
};

export default errorMiddleware;

