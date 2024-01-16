import express from "express";
import {
    getAllOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
} from "./controller.js";

const router = express.Router();

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrder);
router.post("/orders", createOrder);
router.patch("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);
export { router };
