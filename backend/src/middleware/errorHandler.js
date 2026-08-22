export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }

    return res.status(statusCode).json({
        success: false,
        message: message
    });
};
