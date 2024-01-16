import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
export const getAllGigs = asyncWrapper(async (req, res) => {
    res.send("Get All Gigs");
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
