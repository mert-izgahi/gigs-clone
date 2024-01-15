import BaseError from "../errors/base-error.js";

const errorHandler = (error, req, res, next) => {
    const baseError = new BaseError(error.message, error.status);

    return res.status(baseError.status).json({
        data: null,
        error: {
            name: baseError.name,
            message: baseError.message,
        },
    });
};

export default errorHandler;
