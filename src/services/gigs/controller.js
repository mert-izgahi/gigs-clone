import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import sendResponse from "../../helpers/send-response.js";
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
    res.send("Get Gig");
});

export const createGig = asyncWrapper(async (req, res) => {
    res.send("Create Gig");
});

export const updateGig = asyncWrapper(async (req, res) => {
    res.send("Update Gig");
});

export const deleteGig = asyncWrapper(async (req, res) => {
    res.send("Delete Gig");
});
