import NotFoundError from "../errors/not-found-error.js";

const notFound = (req, res, next) => {
    const error = new NotFoundError(`Not Found - ${req.originalUrl}`);
    return res.status(404).send({ error: "Not Found", message: error.message });
};

export default notFound;
