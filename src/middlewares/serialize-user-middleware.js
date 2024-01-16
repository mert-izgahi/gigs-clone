import jwt from "jsonwebtoken";
import config from "../../config.js";
export const serializeUser = (req, res, next) => {
    try {
        const headers = req.headers;

        const authorization = headers.authorization;

        if (!authorization) {
            res.locals.user = null;
            return next();
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return next();
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        res.locals.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};
