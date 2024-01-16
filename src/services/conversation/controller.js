import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import sendResponse from "../../helpers/send-response.js";
import Order from "./model.js";
import Gig from "../gigs/model.js";
export const getAllOrders = asyncWrapper(async (req, res) => {
    const { limit, page, sort, search } = req.query;

    const skip = (page - 1) * limit;
    const queryObj = {
        page: page || 1,
        limit: limit || 10,
        sort: sort || "-createdAt",
    };

    const { orders, totalPages } = await Order.getAll(queryObj);
    sendResponse({
        res,
        status: 200,
        data: { orders, totalPages },
        message: "Gigs fetched successfully",
    });
});

export const getOrder = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const order = await Order.getOne({ _id: id });

    sendResponse({
        res,
        status: 200,
        data: { order },
        message: "Order fetched successfully",
    });
});

export const createOrder = asyncWrapper(async (req, res) => {
    const userId = res.locals.user?.id;
    const gig = await Gig.getOne({ _id: req.body.gig });
    const order = await Order.createOne({
        gig: gig._id,
        image: gig.coverImage,
        user: userId,
        price: gig.price,
    });

    sendResponse({
        res,
        status: 201,
        data: { order },
        message: "Order created successfully",
    });
});

export const updateOrder = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const order = await Order.updateOne({ _id: id }, req.body);

    sendResponse({
        res,
        status: 200,
        data: { order },
        message: "Order updated successfully",
    });
});

export const deleteOrder = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const order = await Order.deleteOne({ _id: id });
    sendResponse({
        res,
        status: 200,
        data: { order },
        message: "Order deleted successfully",
    });
});
