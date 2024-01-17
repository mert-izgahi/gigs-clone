import express from "express";
import { createMessage, deleteMessage, updateMessage } from "./controller.js";
import { withAuth } from "../../middlewares/with-auth-middleware.js";
const router = express.Router();

router.post("/messages", withAuth, createMessage);
router.put("/messages/:id", withAuth, updateMessage);
router.delete("/messages/:id", withAuth, deleteMessage);
export { router };
