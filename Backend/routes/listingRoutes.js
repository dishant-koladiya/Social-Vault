// import express from "express";
// import {
// 	addCredential,
// 	addListing,
// 	deleteUserListing,
// 	getAllPublicListings,
// 	getAllUserListing,
// 	getAllUserOrders,
// 	markFeatured,
// 	purchaseAccount,
// 	toggleStatus,
// 	updateListing,
// 	withdrawAmount,
// } from "../controllers/listingController.js";
// import { protect } from "../middlewares/authMiddleware.js";
// import upload from "../configs/multer.js";

// const listingRouter = express.Router();

// // ⚠️ Specific routes MUST come before wildcard routes like /:id
// listingRouter.post("/", upload.array("images", 5), protect, addListing);
// listingRouter.get("/public", getAllPublicListings);
// listingRouter.get("/user", protect, getAllUserListing);
// listingRouter.get("/user-orders", protect, getAllUserOrders);
// listingRouter.post("/add-credential", protect, addCredential);
// listingRouter.post("/withdraw", protect, withdrawAmount);
// listingRouter.get("/purchase-account/:listingId", protect, purchaseAccount);

// // ⚠️ Wildcard routes MUST come after specific routes
// listingRouter.put("/:id", upload.array("images", 5), protect, updateListing);
// listingRouter.put("/:id/status", protect, toggleStatus);
// listingRouter.delete("/:listingId", protect, deleteUserListing);
// listingRouter.put("/featured/:id", protect, markFeatured);

// export default listingRouter;
import express from "express";
import {
	addCredential,
	addListing,
	deleteUserListing,
	getAllPublicListings,
	getAllUserListing,
	getAllUserOrders,
	getListingById,
	getUserWithdrawals,
	markFeatured,
	purchaseAccount,
	toggleStatus,
	updateListing,
	withdrawAmount,
} from "../controllers/listingController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";

const listingRouter = express.Router();

// Specific routes MUST come before wildcard routes
listingRouter.post("/", upload.array("images", 5), protect, addListing);
listingRouter.get("/public", getAllPublicListings);
listingRouter.get("/user", protect, getAllUserListing);
listingRouter.get("/user-orders", protect, getAllUserOrders);
listingRouter.post("/add-credential", protect, addCredential);
listingRouter.post("/withdraw", protect, withdrawAmount);
listingRouter.get("/my-withdrawals", protect, getUserWithdrawals);
listingRouter.get("/purchase-account/:listingId", protect, purchaseAccount);

// FIX: Registered the missing getListingById route.
// This is needed for the frontend fallback when Redux store is empty
// (e.g. user opens a shared listing link directly).
// Must be placed BEFORE the wildcard PUT /:id routes.
listingRouter.get("/:listingId", getListingById);

// Wildcard routes MUST come after specific routes
listingRouter.put("/:id", upload.array("images", 5), protect, updateListing);
listingRouter.put("/:id/status", protect, toggleStatus);
listingRouter.delete("/:listingId", protect, deleteUserListing);
listingRouter.put("/featured/:id", protect, markFeatured);

export default listingRouter;
