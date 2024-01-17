import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import sendResponse from "../../helpers/send-response.js";
import Order from "./model.js";
import Gig from "../gigs/model.js";
import Conversation from "../conversation/model.js";

export const getRequestedOrders = asyncWrapper(async (req, res) => {
    // Current user orders list
    const { limit, page, sort, search } = req.query;
    const userId = res.locals.user?.id;
    const skip = (page - 1) * limit;
    const queryObj = {
        page: page || 1,
        limit: limit || 10,
        skip: skip,
        sort: sort || "-createdAt",
        requestedBy: userId,
    };

    const { orders, totalPages } = await Order.getAll(queryObj);
    sendResponse({
        res,
        status: 200,
        data: { orders, totalPages },
        message: "Gigs fetched successfully",
    });
});

export const getReceivedOrders = asyncWrapper(async (req, res) => {
    // Current user orders list
    const { limit, page, sort, search } = req.query;
    const userId = res.locals.user?.id;
    const skip = (page - 1) * limit;
    const queryObj = {
        page: page || 1,
        limit: limit || 10,
        skip: skip,
        sort: sort || "-createdAt",
        receivedBy: userId,
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
    const { gigId } = req.body;
    const gig = await Gig.getOne({ _id: gigId });

    const order = await Order.createOne({
        gig: gig._id,
        image: gig.coverImage,
        requestedBy: userId,
        receivedBy: gig.user,
        price: gig.price,
    });
    const conversation = await Conversation.createOne({
        gig: gig._id,
        order: order._id,
        users: [userId, gig.user],
    });

    order.conversation = conversation._id;
    await order.save();

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
