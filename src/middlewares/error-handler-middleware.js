import BaseError from "../errors/base-error.js";

const errorHandler = (error, req, res, next) => {
    const baseError = new BaseError(
        error.message || "Something went wrong",
        500
    );
    console.log("💥", error.message, error.name);
    if (error.name === "BadRequestError") {
        baseError.status = 400;
        baseError.message = error.message;
    }
    if (error.name === "ValidationError") {
        const keys = Object.keys(error.errors);
        keys.forEach((key) => {
            baseError.message = error.errors[key].message;
            baseError.status = 400;
        });
    }
    return res.status(baseError.status).json({
        data: null,
        error: {
            name: baseError.name,
            message: baseError.message,
        },
    });
};

export default errorHandler;
