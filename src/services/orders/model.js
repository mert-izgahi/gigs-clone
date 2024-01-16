import mongoose from "mongoose";
import BadRequestError from "../../errors/bad-request-error.js";

const orderSchema = new mongoose.Schema(
    {
        gig: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gig",
            required: [true, "Please provide gig"],
        },
        image: {
            type: String,
            default: null,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],
        },
        price: {
            type: Number,
            required: [true, "Please provide price"],
        },
        isPaid: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.statics.getAll = async function (query) {
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

orderSchema.statics.createOne = async function (data) {
    const order = await this.create(data);
    if (!order) {
        throw new BadRequestError("Order not created");
    }

    return order;
};

orderSchema.statics.updateOne = async function (query, data) {
    const order = await this.findOneAndUpdate(query, data, {
        new: true,
    });
    if (!order) {
        throw new BadRequestError("Order not updated");
    }
    return order;
};

orderSchema.statics.getOne = async function (query) {
    const order = await this.findOne(query).populate("user");
    if (!order) {
        throw new BadRequestError("Order not found");
    }
    return order;
};

orderSchema.statics.deleteOne = async function (query) {
    const order = await this.findOneAndDelete(query);
    if (!order) {
        throw new BadRequestError("Order not deleted");
    }
    return order;
};

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
