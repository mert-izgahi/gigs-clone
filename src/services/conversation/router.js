import express from "express";
import {
    getAllConversations,
    getConversation,
    deleteConversation,
} from "./controller.js";
import { withAuth } from "../../middlewares/with-auth-middleware.js";
const router = express.Router();

router.get("/conversations", withAuth, getAllConversations);
router.get("/conversations/:id", withAuth, getConversation);
router.delete("/conversations/:id", withAuth, deleteConversation);
export { router };
