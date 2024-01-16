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
            res.locals.user = null;
            return next();
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            res.locals.user = null;
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

import AuthenticationError from "../errors/authentication-error.js";

export const withAuth = (req, res, next) => {
    const user = res.locals.user;
    if (!user) {
        throw new AuthenticationError("Invalid token. Please log in again.");
    }
    next();
};
```

```js
// ./src/middlewares/error-handler-middleware.js
import BaseError from "../errors/base-error";

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
```

```js
// ./src/middlewares/not-found-middleware.js
import NotFoundError from "../errors/not-found-error";

const notFound = (req, res, next) => {
    const error = new NotFoundError(`Not Found - ${req.originalUrl}`);
    next(error);
};

export default notFound;
```

### Build User Model

to start models,first we will build user model, which include name, email, password and role. also , jobTitle, bio properties, and timestamps. to track creation and update date.

```js
// ./src/services/users/model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: null,
        },
        jobTitle: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);
```

### Password Hashing

using bcryptjs to hash password.

```js
import bcryptjs from "bcryptjs";
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, config.SALT_ROUNDS);
    }
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
```

### Generate Auth Token

```js
// ./src/services/users/model.js
import jwt from "jsonwebtoken";
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRY,
    });
};
```

### User PasswordRestToken setup

```js
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    return resetToken;
};
```

### User Base Controllers

```js
userSchema.statics.createUser = async function (data) {
    const { email } = data;
    const userDoc = await this.findOne({ email });
    if (userDoc) {
        throw new BadRequestError("User already exists");
    }
    const user = await this.create(data);
    return user;
};

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email }).select("+password");
    if (!user) {
        throw new BadRequestError("Invalid credentials");
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
        throw new BadRequestError("Invalid credentials");
    }
    return user;
};
```

```js
userSchema.statics.createUser = async function (data) {
    const { email } = data;
    const userDoc = await this.findOne({ email });
    if (userDoc) {
        throw new BadRequestError("User already exists");
    }
    const user = await this.create(data);
    return user;
};

userSchema.statics.getByCredentials = async function (email, password) {
    const user = await this.findOne({ email }).select("+password");
    if (!user) {
        throw new BadRequestError("Invalid credentials");
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
        throw new BadRequestError("Invalid credentials");
    }
    return user;
};

userSchema.statics.getOne = async function (query) {
    const user = await this.findOne(query);
    if (!user) {
        throw new BadRequestError("User not found");
    }
    return user;
};
```

### User Controllers

```js
// ./src/services/users/controller.js
import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";

export const registerUser = asyncWrapper(async (req, res) => {
    res.send("Create User");
});

export const loginUser = asyncWrapper(async (req, res) => {
    res.send("Login User");
});

export const logoutUser = asyncWrapper(async (req, res) => {
    res.send("Logout User");
});

export const forgotPassword = asyncWrapper(async (req, res) => {
    res.send("Forgot Password");
});

export const resetPassword = asyncWrapper(async (req, res) => {
    res.send("Reset Password");
});

export const updatePassword = asyncWrapper(async (req, res) => {
    res.send("Update Password");
});

export const getProfile = asyncWrapper(async (req, res) => {
    res.send("Get Profile");
});

export const updateProfile = asyncWrapper(async (req, res) => {
    res.send("Update Profile");
});

export const deleteUser = asyncWrapper(async (req, res) => {
    res.send("Delete User");
});

export const getAllUsers = asyncWrapper(async (req, res) => {
    res.send("Get All Users");
});

export const getUser = asyncWrapper(async (req, res) => {
    res.send("Get User");
});
```

### User Routes

```js
import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    updatePassword,
    getProfile,
    updateProfile,
    deleteUser,
    getAllUsers,
    getUser,
} from "./controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/update-password", updatePassword);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);

export { router };
```

### Register User Services

```js
// ./index.js
app.listen(PORT, async () => {
    // ...
    // ROUTERS
    app.use("/api/v1", usersRouter);
    // ...
    console.log(`Server started on http://localhost:${PORT}`);
});
```

#### Register User

```js
export const registerUser = asyncWrapper(async (req, res) => {
    const user = await User.createUser(req.body);
    return sendResponse({
        res,
        status: 201,
        data: { user },
        message: "User created successfully",
    });
});
```

and fix error handler

````js
console.log("💥", baseError.message, error.name);
    if (error.name === "ValidationError") {
        const keys = Object.keys(error.errors);
        keys.forEach((key) => {
            baseError.message = error.errors[key].message;
            baseError.status = 400;
        });
    }
    ```
````

### Login User Services

```js
export const loginUser = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.getByCredentials(email, password);
    if (!user) {
        throw new BadRequestError("Invalid credentials,please try again");
    }
    const token = await user.getSignedJwtToken();

    if (!token) {
        throw new BadRequestError("Invalid credentials,please try again");
    }

    user.password = undefined;

    sendResponse({
        res,
        status: 200,
        data: { user, token },
        message: "User logged in successfully",
    });
});
```

### Get Profile Service

```js
export const getProfile = asyncWrapper(async (req, res) => {
    const userId = res.locals.user?.id;
    const profile = await User.getOne({ _id: userId });
    sendResponse({
        res,
        status: 200,
        data: { profile },
        message: "Profile fetched successfully",
    });
});
```

### Get All Users Service

```js
// ./src/services/users/model.js
userSchema.statics.getAll = async function (query) {
    const { limit, skip, sort, search } = query;

    const users = await this.find(search).limit(limit).skip(skip).sort(sort);

    if (!users) {
        throw new BadRequestError("Users not found");
    }

    const totalPages = Math.ceil(
        (await this.find(search).countDocuments()) / limit
    );

    return { users, totalPages };
};
```

```js
export const getAllUsers = asyncWrapper(async (req, res) => {
    const { limit, page, sort, search } = req.query;
    const skip = (page - 1) * limit;
    let queryObj = {
        page: page || 1,
        limit: limit || 10,
        sort: sort || "createdAt",
    };

    if (search) {
        queryObj = {
            ...queryObj,
            search: { name: { $regex: search, $options: "i" } },
        };
    }

    const { users } = await User.getAll(queryObj);
    sendResponse({
        res,
        status: 200,
        data: { users },
        message: "Users fetched successfully",
    });
});
```

### Get User Service

```js
export const getUser = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const user = await User.getOne({ _id: id });
    sendResponse({
        res,
        status: 200,
        data: { user },
        message: "User fetched successfully",
    });
});
```

### Upload Profile Image

```js
import { v2 as cloudinary } from "cloudinary";
import config from "../../config.js";
cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
});
export const uploadImage = async (image) => {
    try {
        const res = await cloudinary.uploader.upload(image.tempFilePath);
        const imageUrl = res.secure_url;
        return imageUrl;
    } catch (error) {
        throw new Error(error.message);
    }
};
```

```js
const image = req.files?.image;

if (image) {
    if (Array.isArray(image)) {
        throw new BadRequestError("Please upload only one image");
    }

    const secure_url = await uploadImage(image);
    req.body.image = secure_url;
}
```

### MAIL SENDER SETUP

```js
// ./src/helpers/mail-sender.js
import config from "../../config.js";

class MailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.MAIL_TRAP_HOST,
            port: config.MAIL_TRAP_PORT,
            auth: {
                user: config.MAIL_TRAP_USER,
                pass: config.MAIL_TRAP_PASS,
            },
        });
    }

    sendResetPasswordEmail(email, token) {
        const mailOptions = {
            from: config.MAIL_TRAP_USER,
            to: email,
            subject: "Reset Password",
            text: `Click here to reset your password: ${config.CLIENT_URL}/reset-password/${token}`,
        };

        return this.transporter.sendMail(mailOptions);
    }
}
```

```js
// ./src/services/users/model.js
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    return resetToken;
};
userSchema.statics.getByRestToken = async function (token) {
    // decode token
    const decodedToken = await crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user = await this.findOne({
        resetPasswordToken: decodedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        throw new BadRequestError("Invalid token, please try again");
    }
    return user;
};
```

### Gig Model

```js
// ./src/services/gigs/model.js
import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide title"],
        },
        description: {
            type: String,
            required: [true, "Please provide description"],
        },
        rating: {
            type: Number,
            default: 0,
        },
        reviewsCount: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "Please provide price"],
            default: 0,
        },
        coverImage: {
            type: String,
            default: null,
        },
        category: {
            type: String,
            required: [true, "Please provide category"],
            enum: {
                values: [
                    "Graphics & Design",
                    "Video & Animation",
                    "Music & Audio",
                    "Writing & Translation",
                    "Programming & Tech",
                    "Business",
                    "Lifestyle",
                    "Data",
                    "Other",
                ],
                message: "{VALUE} is not supported",
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],
        },
    },
    {
        timestamps: true,
    }
);

gigSchema.set("toJSON", { virtuals: true });
gigSchema.set("toObject", { virtuals: true });

const Gig = mongoose.model("Gig", gigSchema);

export default Gig;
```

### Gig Controller

```js
// ./src/services/gigs/controller.js
import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
export const getAllGigs = asyncWrapper(async (req, res) => {
    res.send("Get All Gigs");
});

export const getGig = asyncWrapper(async (req, res) => {
    res.send("Get Gig");
});

export const createGig = asyncWrapper(async (req, res) => {
    res.send("Create Gig");
});

export const updateGig = asyncWrapper(async (req, res) => {
    res.send("Update Gig");
});

export const deleteGig = asyncWrapper(async (req, res) => {
    res.send("Delete Gig");
});
```

# Gig Routes

```js
import express from "express";
import {
    getAllGigs,
    getGig,
    createGig,
    updateGig,
    deleteGig,
} from "./controller.js";

const router = express.Router();

router.get("/gigs", getAllGigs);
router.get("/gigs/:id", getGig);
router.post("/gigs", createGig);
router.patch("/gigs/:id", updateGig);
router.delete("/gigs/:id", deleteGig);

export default router;
```
