import express from "express";
import {
    getAllGigs,
    getGig,
    createGig,
    updateGig,
    deleteGig,
} from "./controller.js";

const router = express.Router();

router.get("/gigs", getAllGigs);
router.get("/gigs/:id", getGig);
router.post("/gigs", createGig);
router.patch("/gigs/:id", updateGig);
router.delete("/gigs/:id", deleteGig);

export default router;
