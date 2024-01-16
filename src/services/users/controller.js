import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import { createUser } from "./model.js";
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
