### SETUP EXPRESS SERVER

to start with we will need to set up the express server. so we need to install express and npm install express. then we need to setup index.js and start server with nodemon index.js

```js
import express from "express";
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log(`Server started on http://localhost:${3000}`);
});
```

### SETUP DOTENV

we need to install dotenv and npm install dotenv and setup .env file.

```js
import dotenv from "dotenv";
dotenv.config();
```

### FOLDER STRUCTURE

```tree
.
└── root/
    ├── package.json
    ├── package-lock.json
    ├── node_modules
    ├── index.js
    ├── .env
    ├── config.js
    └── src/
        ├── middlewares/
        |   ├── async-wrapper-middleware.js
        │   ├── serialize-user-middleware.js
        │   ├── with-auth-middleware.js
        │   ├── error-handler-middleware.js
        │   ├── not-found-middleware.js
        │   └── ...
        ├── errors/
        │   ├── base-error.js
        │   ├── authentication-error.js
        │   ├── not-found-error.js
        │   ├── bad-request-error.js
        │   └── ...
        ├── helpers/
        │   ├── connect-db.js
        │   └── ...
        └── services/
            ├── users/
            │   ├── model.js
            │   ├── router.js
            │   └── controller.js
            ├── gigs/
            │   ├── model.js
            │   ├── router.js
            │   └── controller.js
            ├── reviews/
            │   ├── model.js
            │   ├── router.js
            │   └── controller.js
            ├── orders/
            │   ├── model.js
            │   ├── router.js
            │   └── controller.js
            ├── chat/
            │   ├── model.js
            │   ├── router.js
            │   └── controller.js
            └── ...
```

### SETUP DATABASE

to connect to database we need to install mongoose and npm install mongoose and setup .env file.

```js
// ../src/helpers/connect-db.js
import mongoose from "mongoose";

export default async function connectDB(connectionString) {
    try {
        const conn = await mongoose.connect(connectionString);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
```

### SETUP ERROR CLASSES

to setup error classes we need to create base-error, authentication-error, not-found-error, bad-request-error in errors folder.

```js
// ./src/errors/base-error.js

class BaseError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
    }
}

export default BaseError;
```

```js
// ./src/errors/authentication-error.js

import BaseError from "./base-error";

class AuthenticationError extends BaseError {
    constructor(message) {
        super(message, 401);
    }
}

export default AuthenticationError;
```

```js
// ./src/errors/not-found-error.js

import BaseError from "./base-error";

class NotFoundError extends BaseError {
    constructor(message) {
        super(message, 404);
    }
}

export default NotFoundError;
```

```js
// ./src/errors/bad-request-error.js

import BaseError from "./base-error";

class BadRequestError extends BaseError {
    constructor(message) {
        super(message, 400);
    }
}

export default BadRequestError;
```

### SETUP MIDDLEWARES

to setup middlewares we need to create async-wrapper-middleware, serialize-user-middleware, with-auth-middleware, error-handler-middleware, not-found-middleware in middlewares folder.

```js
// ./src/middlewares/async-wrapper-middleware.js
export default (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};
```

```js
./src/middlewares/serialize-user-middleware.js
import jwt from "jsonwebtoken";
import config from "../../config.js";
export const serializeUser = (req, res, next) => {
    try {
        const headers = req.headers;

        const authorization = headers.authorization;

        if (!authorization) {
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
```

```js
// ./src/middlewares/with-auth-middleware.js
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
```
