import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import sendResponse from "../../helpers/send-response.js";
import Conversation from "./model.js";
import Message from "../messages/model.js";

export const getAllConversations = asyncWrapper(async (req, res) => {
    const userId = res.locals.user?.id;
    const { limit, page, sort, search } = req.query;

    const skip = (page - 1) * limit;
    const queryObj = {
        page: page || 1,
        limit: limit || 10,
        skip: skip,
        sort: sort || "-createdAt",
        search: { users: { $in: [userId] } },
    };

    if (search) {
        queryObj.search = {
            ...queryObj.search,
            title: { $regex: search, $options: "i" },
        };
    }

    const { conversations, totalPages } = await Conversation.getAll(queryObj);
    sendResponse({
        res,
        status: 200,
        data: { conversations, totalPages },
        message: "Conversations fetched successfully",
    });
});

export const getConversation = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const messages = await Message.getAll({
        conversation: id,
    });
    await Promise.all(
        messages.map(async (message) => {
            message.isRead = true;
            await message.save();
        })
    );

    const conversation = await Conversation.getOne({ _id: id });

    sendResponse({
        res,
        status: 200,
        data: { conversation },
        message: "Conversation fetched successfully",
    });
});

export const deleteConversation = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const conversation = await Conversation.deleteOne({ _id: id });

    sendResponse({
        res,
        status: 200,
        data: { conversation },
        message: "Conversation deleted successfully",
    });
});
