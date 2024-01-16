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

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/update-password", updatePassword);
router.get("/auth/profile", getProfile);
router.put("/auth/profile", updateProfile);
router.delete("/users/:id", deleteUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);

export { router };