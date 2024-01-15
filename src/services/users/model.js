import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../../../config.js";
import jwt from "jsonwebtoken";

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
        this.password = await bcrypt.hash(this.password, config.SALT_ROUNDS);
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

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", userSchema);
