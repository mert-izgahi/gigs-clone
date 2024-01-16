import mongoose from "mongoose";
import BadRequestError from "../../errors/bad-request-error.js";

const gigSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide title"],
        },
        description: {
            type: String,
            required: [true, "Please provide description"],
        },
        rating: {
            type: Number,
            default: 0,
        },
        reviewsCount: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "Please provide price"],
            default: 0,
        },
        coverImage: {
            type: String,
            default: null,
        },
        category: {
            type: String,
            required: [true, "Please provide category"],
            enum: {
                values: [
                    "Graphics & Design",
                    "Video & Animation",
                    "Music & Audio",
                    "Writing & Translation",
                    "Programming & Tech",
                    "Business",
                    "Lifestyle",
                    "Data",
                    "Other",
                ],
                message: "{VALUE} is not supported",
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],
        },
    },
    {
        timestamps: true,
    }
);

gigSchema.statics.getAll = async function (query) {
    const { limit, skip, sort, search } = query;

    const gigs = await this.find(search).limit(limit).skip(skip).sort(sort);

    if (!gigs) {
        throw new BadRequestError("Gigs not found");
    }

    const totalPages = Math.ceil(
        (await this.find(search).countDocuments()) / limit
    );

    return { gigs, totalPages };
};

gigSchema.statics.createOne = async function (data) {
    const gig = await this.create(data);
    if (!gig) {
        throw new BadRequestError("Gig not created");
    }

    return gig;
};

gigSchema.statics.updateOne = async function (query, data) {
    const gig = await this.findOneAndUpdate(query, data, {
        new: true,
    });
    if (!gig) {
        throw new BadRequestError("Gig not updated");
    }
    return gig;
};

gigSchema.statics.deleteOne = async function (query) {
    const gig = await this.findOneAndDelete(query);
    if (!gig) {
        throw new BadRequestError("Gig not deleted");
    }
    return gig;
};

gigSchema.statics.getOne = async function (query) {
    const gig = await this.findOne(query).populate("user");
    if (!gig) {
        throw new BadRequestError("Gig not found");
    }
    return gig;
};

gigSchema.set("toJSON", { virtuals: true });
gigSchema.set("toObject", { virtuals: true });

const Gig = mongoose.model("Gig", gigSchema);

export default Gig;
