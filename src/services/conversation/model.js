import mongoose from "mongoose";
import BadRequestError from "../../errors/bad-request-error.js";

const conversationSchema = new mongoose.Schema(
    {
        gig: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gig",
            required: [true, "Please provide gig"],
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: [true, "Please provide order"],
        },

        users: [
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

conversationSchema.virtual("messages", {
    ref: "Message",
    localField: "_id",
    foreignField: "conversation",
});

conversationSchema.virtual("messagesCount", {
    ref: "Message",
    localField: "_id",
    foreignField: "conversation",
    count: true,
});

conversationSchema.virtual("unreadMessagesCount", {
    ref: "Message",
    localField: "_id",
    foreignField: "conversation",
    count: true,
    match: {
        isRead: false,
    },
});

conversationSchema.pre(/^findOne/, function (next) {
    this.populate("messages");
    this.populate("unreadMessagesCount");
    this.populate("messagesCount");
    next();
});

conversationSchema.statics.createOne = async function (data) {
    const conversation = await this.create(data);
    if (!conversation) {
        throw new BadRequestError("Conversation not created");
    }
    return conversation;
};

conversationSchema.statics.getAll = async function (query) {
    const { limit, skip, sort, search } = query;

    const conversations = await this.find(search)
        .limit(limit)
        .skip(skip)
        .sort(sort);

    if (!conversations) {
        throw new BadRequestError("Conversations not found");
    }

    const totalPages = Math.ceil(
        (await this.find(search).countDocuments()) / limit
    );

    return { conversations, totalPages };
};

conversationSchema.statics.getOne = async function (query) {
    const conversation = await this.findOne(query);
    if (!conversation) {
        throw new BadRequestError("Conversation not found");
    }
    return conversation;
};

conversationSchema.set("toJSON", { virtuals: true });
conversationSchema.set("toObject", { virtuals: true });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
