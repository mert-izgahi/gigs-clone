import mongoose from "mongoose";
import BadRequestError from "../../errors/bad-request-error.js";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide sender"],
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide receiver"],
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        content: {
            type: String,
            required: [true, "Please provide content"],
        },

        type: {
            type: String,
            enum: ["Text", "Image", "Video", "File"],
            default: "Text",
        },

        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: [true, "Please provide conversation"],
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.statics.getAll = async function (query) {
    const messages = await this.find(query);
    if (!messages) {
        throw new BadRequestError("Messages not found");
    }
    return messages;
};

messageSchema.statics.createOne = async function (data) {
    const message = await this.create(data);
    if (!message) {
        throw new BadRequestError("Message not created");
    }
    return message;
};

messageSchema.statics.deleteOne = async function (query) {
    const message = await this.deleteOne(query);
    if (!message) {
        throw new BadRequestError("Message not deleted");
    }
    return message;
};

messageSchema.statics.updateOne = async function (query, data) {
    const message = await this.updateOne(query, data);
    if (!message) {
        throw new BadRequestError("Message not updated");
    }
    return message;
};

messageSchema.set("toJSON", { virtuals: true });
messageSchema.set("toObject", { virtuals: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;
