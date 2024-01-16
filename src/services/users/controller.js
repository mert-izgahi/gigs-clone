import BadRequestError from "../../errors/bad-request-error.js";
import sendResponse from "../../helpers/send-response.js";
import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import User from "./model.js";
export const registerUser = asyncWrapper(async (req, res) => {
    const user = await User.createUser(req.body);
    return sendResponse({
        res,
        status: 201,
        data: { user },
        message: "User created successfully",
    });
});

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
    const userId = res.locals.user?.id;
    const profile = await User.getOne({ _id: userId });
    sendResponse({
        res,
        status: 200,
        data: { profile },
        message: "Profile fetched successfully",
    });
});

export const updateProfile = asyncWrapper(async (req, res) => {
    const userId = res.locals.user?.id;

    const user = await User.updateOne({ _id: userId }, req.body);
    sendResponse({
        res,
        status: 200,
        data: { user },
        message: "Profile updated successfully",
    });
});

export const deleteUser = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const user = await User.deleteOne({ _id: id });

    sendResponse({
        res,
        status: 200,
        data: { user },
        message: "User deleted successfully",
    });
});

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
