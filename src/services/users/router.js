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
import { withAuth } from "../../middlewares/with-auth-middleware.js";
const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/update-password", updatePassword);
router.get("/auth/profile", withAuth, getProfile);
router.patch("/auth/profile", updateProfile);
router.delete("/users/:id", deleteUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);

export { router };
