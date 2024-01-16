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
