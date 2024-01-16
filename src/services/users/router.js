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
router.post("/auth/reset-password/:token", resetPassword);
router.post("/auth/update-password", withAuth, updatePassword);
router.get("/auth/profile", withAuth, getProfile);
router.patch("/auth/profile", withAuth, updateProfile);
router.delete("/users/:id", withAuth, deleteUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);

export { router };
