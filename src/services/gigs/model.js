import mongoose from "mongoose";

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

gigSchema.set("toJSON", { virtuals: true });
gigSchema.set("toObject", { virtuals: true });

const Gig = mongoose.model("Gig", gigSchema);

export default Gig;
