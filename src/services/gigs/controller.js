import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import sendResponse from "../../helpers/send-response.js";
import BadRequestError from "../../errors/bad-request-error.js";
import { uploadImage } from "../../helpers/upload-image.js";
import Gig from "./model.js";
export const getAllGigs = asyncWrapper(async (req, res) => {
    const { limit, page, sort, search, category } = req.query;

    const skip = (page - 1) * limit;
    const queryObj = {
        page: page || 1,
        limit: limit || 10,
        sort: sort || "-createdAt",
    };

    if (category) {
        queryObj.category = category;
    }

    if (search) {
        queryObj.search = { title: { $regex: search, $options: "i" } };
    }

    const { gigs, totalPages } = await Gig.getAll(queryObj);
    sendResponse({
        res,
        status: 200,
        data: { gigs, totalPages },
        message: "Gigs fetched successfully",
    });
});

export const getGig = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const gig = await Gig.getOne({ _id: id });

    sendResponse({
        res,
        status: 200,
        data: { gig },
        message: "Gig fetched successfully",
    });
});

export const createGig = asyncWrapper(async (req, res) => {
    const userId = res.locals.user?.id;

    const image = req.files?.image;
    if (image) {
        if (Array.isArray(image)) {
            throw new BadRequestError("Please upload only one image");
        }
        const secure_url = await uploadImage(image);
        req.body.coverImage = secure_url;
    }

    const gig = await Gig.createOne({ ...req.body, user: userId });
    sendResponse({
        res,
        status: 201,
        data: { gig },
        message: "Gig created successfully",
    });
});

export const updateGig = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const image = req.files?.image;
    if (image) {
        if (Array.isArray(image)) {
            throw new BadRequestError("Please upload only one image");
        }
        const secure_url = await uploadImage(image);
        req.body.coverImage = secure_url;
    }

    const gig = await Gig.updateOne({ _id: id }, req.body);
    if (!gig) {
        throw new BadRequestError("Gig not updated");
    }

    sendResponse({
        res,
        status: 200,
        data: { gig },
        message: "Gig updated successfully",
    });
});

export const deleteGig = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const gig = await Gig.deleteOne({ _id: id });
    sendResponse({
        res,
        status: 200,
        data: { gig },
        message: "Gig deleted successfully",
    });
});
