import NotFoundError from "../errors/not-found-error";

const notFound = (req, res, next) => {
    const error = new NotFoundError(`Not Found - ${req.originalUrl}`);
    next(error);
};

export default notFound;
