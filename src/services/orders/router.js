import express from "express";
import {
    getRequestedOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    getReceivedOrders,
} from "./controller.js";

const router = express.Router();

router.get("/orders/requested", getRequestedOrders);
router.get("/orders/received", getReceivedOrders);
router.get("/orders/:id", getOrder);
router.post("/orders", createOrder);
router.patch("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);
export { router };
