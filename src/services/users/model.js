import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../../../config.js";
import jwt from "jsonwebtoken";
import BadRequestError from "../../errors/bad-request-error.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide email"],
            unique: [true, "Email already exists"],
        },
        password: {
            type: String,
            required: [true, "Please provide password"],
            select: false,
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
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpire: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = Number(config.SALT_ROUNDS) || 10;
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRY,
    });
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    return resetToken;
};

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
        throw new BadRequestError("Invalid credentials,please try again");
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
        throw new BadRequestError("Invalid credentials,please try again");
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

userSchema.statics.getAll = async function (query) {
    const { limit, page, sort, search } = query;
    const skip = (page - 1) * limit;
    const users = await this.find(search).limit(limit).skip(skip).sort(sort);

    if (!users) {
        throw new BadRequestError("Users not found");
    }

    const totalPages = Math.ceil(
        (await this.find(search).countDocuments()) / limit
    );

    return { users, totalPages };
};

userSchema.statics.deleteOne = async function (query) {
    const user = await this.findOneAndDelete(query);
    if (!user) {
        throw new BadRequestError("User not found");
    }
    return user;
};

userSchema.statics.updateOne = async function (query, data) {
    const user = await this.findOneAndUpdate(query, data, {
        new: true,
    });
    if (!user) {
        throw new BadRequestError("User not found");
    }
    return user;
};

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);

export default User;
