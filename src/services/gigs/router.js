import express from "express";
import {
    getAllGigs,
    getGig,
    createGig,
    updateGig,
    deleteGig,
} from "./controller.js";
import { withAuth } from "../../middlewares/with-auth-middleware.js";
const router = express.Router();

router.get("/gigs", getAllGigs);
router.get("/gigs/:id", getGig);
router.post("/gigs", withAuth, createGig);
router.patch("/gigs/:id", withAuth, updateGig);
router.delete("/gigs/:id", withAuth, deleteGig);

export { router };
