import BaseError from "./base-error";

class AuthenticationError extends BaseError {
    constructor(message) {
        super(message, 401);
    }
}

export default AuthenticationError;
