import BaseError from "./base-error.js";

class AuthenticationError extends BaseError {
    constructor(message) {
        super(message, 401);
    }
}

export default AuthenticationError;
