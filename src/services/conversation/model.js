import mongoose from "mongoose";
import BadRequestError from "../../errors/bad-request-error.js";

const conversationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],
        },
        gig: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gig",
            required: [true, "Please provide gig"],
        },

        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            },
        ],

        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        unreadBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

conversationSchema.statics.getAll = async function (query) {
    const { limit, skip, sort, search } = query;

    const orders = await this.find(search).limit(limit).skip(skip).sort(sort);

    if (!orders) {
        throw new BadRequestError("Orders not found");
    }

    const totalPages = Math.ceil(
        (await this.find(search).countDocuments()) / limit
    );

    return { orders, totalPages };
};

conversationSchema.statics.createOne = async function (data) {
    const order = await this.create(data);
    if (!order) {
        throw new BadRequestError("Order not created");
    }

    return order;
};

conversationSchema.statics.updateOne = async function (query, data) {
    const order = await this.findOneAndUpdate(query, data, {
        new: true,
    });
    if (!order) {
        throw new BadRequestError("Order not updated");
    }
    return order;
};

conversationSchema.statics.getOne = async function (query) {
    const order = await this.findOne(query).populate("user");
    if (!order) {
        throw new BadRequestError("Order not found");
    }
    return order;
};

conversationSchema.statics.deleteOne = async function (query) {
    const order = await this.findOneAndDelete(query);
    if (!order) {
        throw new BadRequestError("Order not deleted");
    }
    return order;
};

conversationSchema.set("toJSON", { virtuals: true });
conversationSchema.set("toObject", { virtuals: true });

const Order = mongoose.model("Order", conversationSchema);

export default Order;
