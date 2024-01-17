import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import sendResponse from "../../helpers/send-response.js";
import Message from "./model.js";
import Conversation from "../conversation/model.js";

export const deleteMessage = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const message = await Message.deleteOne({ _id: id });
    sendResponse({
        res,
        status: 200,
        data: { message },
        message: "Message deleted successfully",
    });
});

export const updateMessage = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const message = await Message.updateOne({ _id: id }, req.body);
    sendResponse({
        res,
        status: 200,
        data: { message },
        message: "Message updated successfully",
    });
});

export const createMessage = asyncWrapper(async (req, res) => {
    const { conversationId } = req.body;
    const userId = res.locals.user?.id;
    const conversation = await Conversation.getOne({ _id: conversationId });

    req.body.sender = conversation.users.find((user) => user == userId);
    req.body.receiver = conversation.users.find((user) => user != userId);
    req.body.conversation = conversation._id;

    const message = await Message.createOne(req.body);
    sendResponse({
        res,
        status: 200,
        data: { message },
        message: "Message created successfully",
    });
});
