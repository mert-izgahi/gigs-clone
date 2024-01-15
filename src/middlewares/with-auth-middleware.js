import AuthenticationError from "../errors/authentication-error";

export const withAuth = (func) => {
    return (req, res, next) => {
        const user = res.locals.user;

        if (!user) {
            throw new AuthenticationError(
                "Invalid token. Please log in again."
            );
        }

        next();
    };
};
