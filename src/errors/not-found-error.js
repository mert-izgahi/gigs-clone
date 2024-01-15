import BaseError from "./base-error";

class NotFoundError extends BaseError {
    constructor(message) {
        super(message, 404);
    }
}

export default NotFoundError;
