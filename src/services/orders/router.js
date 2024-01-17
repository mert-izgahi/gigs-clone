import express from "express";
import {
    getRequestedOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    getReceivedOrders,
} from "./controller.js";
import { withAuth } from "../../middlewares/with-auth-middleware.js";
const router = express.Router();

router.get("/orders/requested", withAuth, getRequestedOrders);
router.get("/orders/received", withAuth, getReceivedOrders);
router.get("/orders/:id", withAuth, getOrder);
router.post("/orders", withAuth, createOrder);
router.patch("/orders/:id", withAuth, updateOrder);
router.delete("/orders/:id", withAuth, deleteOrder);
export { router };
