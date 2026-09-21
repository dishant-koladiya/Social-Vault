// import imageKit from "../configs/imageKit.js";
// import fs from "fs";
// import prisma from "../configs/prisma.js";
// import Stripe from "stripe";
// import { inngest } from "../inngest/index.js";

// export const addListing = async (req, res) => {
// 	try {
// 		const userId = req.user.id;
// 		if (req.plan !== "premium") {
// 			const listingCount = await prisma.listing.count({
// 				where: { ownerId: userId },
// 			});
// 			if (listingCount >= 5) {
// 				return res
// 					.status(400)
// 					.json({ message: "you have reached the free listing limit" });
// 			}
// 		}
// 		const accountDetails = JSON.parse(req.body.accountDetails);

// 		accountDetails.followers_count = parseInt(accountDetails.followers_count);
// 		accountDetails.engagement_rate = parseInt(accountDetails.engagement_rate);
// 		accountDetails.monthly_views = parseInt(accountDetails.monthly_views);
// 		accountDetails.price = parseInt(accountDetails.price);
// 		accountDetails.platform = accountDetails.platform.toLowerCase();
// 		accountDetails.niche = accountDetails.niche.toLowerCase();

// 		accountDetails.username = accountDetails.username.startsWith("@")
// 			? accountDetails.username.slice(1)
// 			: null;

// 		const uploadImages = req.files.map(async (file) => {
// 			const response = await imageKit.files.upload({
// 				file: fs.createReadStream(file.path),
// 				fileName: `${Date.now()}.png`,
// 				folder: "filp-earn",
// 				transformation: { pre: "w-1280,h-auto" },
// 			});
// 			return response.url;
// 		});

// 		const images = await Promise.all(uploadImages);
// 		const listing = await prisma.listing.create({
// 			data: {
// 				ownerId: userId,
// 				images,
// 				...accountDetails,
// 			},
// 		});
// 		return res
// 			.status(201)
// 			.json({ message: "Account Listed successfully", listing });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.code || error.message });
// 	}
// };

// export const getAllPublicListings = async (req, res) => {
// 	try {
// 		const listings = await prisma.listing.findMany({
// 			where: { status: "active" },
// 			include: { owner: true },
// 			orderBy: { createdAt: "desc" },
// 		});

// 		if (!listings || listings.length === 0) {
// 			return res.json({ listings: [] });
// 		}
// 		return res.json({ listings });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.code || error.message });
// 	}
// };

// export const getAllUserListing = async (req, res) => {
// 	try {
// 		const userId = req.user.id;

// 		const listings = await prisma.listing.findMany({
// 			where: { ownerId: userId, status: { not: "deleted" } },
// 			orderBy: { createdAt: "desc" },
// 		});

// 		const user = await prisma.user.findUnique({
// 			where: { id: userId },
// 		});

// 		// User might not exist in DB yet (e.g. just signed up via Clerk)
// 		const balance = user
// 			? {
// 					earned: user.earned,
// 					withdrawn: user.withdrawn,
// 					available: user.earned - user.withdrawn,
// 				}
// 			: { earned: 0, withdrawn: 0, available: 0 };

// 		return res.json({ listings: listings || [], balance });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.code || error.message });
// 	}
// };

// export const updateListing = async (req, res) => {
// 	try {
// 		const userId = req.user.id;
// 		const { id } = req.params;

// 		const accountDetails = JSON.parse(req.body.accountDetails);

// 		if (req.files.length + (accountDetails.images?.length || 0) > 5) {
// 			return res
// 				.status(400)
// 				.json({ message: "You can only upload up to 5 images" });
// 		}

// 		accountDetails.followers_count = parseInt(accountDetails.followers_count);
// 		accountDetails.engagement_rate = parseInt(accountDetails.engagement_rate);
// 		accountDetails.monthly_views = parseInt(accountDetails.monthly_views);
// 		accountDetails.price = parseInt(accountDetails.price);
// 		accountDetails.platform = accountDetails.platform.toLowerCase();
// 		accountDetails.niche = accountDetails.niche.toLowerCase();
// 		accountDetails.username = accountDetails.username
// 			? accountDetails.username.replace(/^@/, "")
// 			: "";

// 		const existingListing = await prisma.listing.findFirst({
// 			where: { id, ownerId: userId },
// 		});

// 		if (!existingListing) {
// 			return res.status(404).json({ message: "Listing not found" });
// 		}

// 		if (existingListing.status === "sold") {
// 			return res
// 				.status(400)
// 				.json({ message: "You can't update sold listings" });
// 		}

// 		let newImages = [];
// 		if (req.files.length > 0) {
// 			const uploadImages = req.files.map((file) =>
// 				imageKit.files.upload({
// 					file: fs.createReadStream(file.path),
// 					fileName: `${Date.now()}.png`,
// 					folder: "filp-earn",
// 					transformation: { pre: "w-1280,h-auto" },
// 				}),
// 			);
// 			newImages = (await Promise.all(uploadImages)).map((r) => r.url);
// 		}

// 		const updatedListing = await prisma.listing.update({
// 			where: { id },
// 			data: {
// 				...accountDetails,
// 				images: [...(accountDetails.images || []), ...newImages],
// 			},
// 		});

// 		return res.json({
// 			message: "Account Updated successfully",
// 			listing: updatedListing,
// 		});
// 	} catch (error) {
// 		console.log("Update Listing Error:", error);
// 		return res.status(500).json({ message: error.message });
// 	}
// };

// export const toggleStatus = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const userId = req.user.id;

// 		const listing = await prisma.listing.findFirst({
// 			where: { id, ownerId: userId },
// 		});
// 		if (!listing) {
// 			return res.status(404).json({ message: "Listing not found" });
// 		}

// 		if (listing.status === "ban") {
// 			return res.status(400).json({ message: "Your listing is banned" });
// 		} else if (listing.status === "sold") {
// 			return res.status(400).json({ message: "Your listing is sold" });
// 		}

// 		const newStatus = listing.status === "active" ? "inactive" : "active";

// 		await prisma.listing.update({
// 			where: { id },
// 			data: { status: newStatus },
// 		});

// 		return res.json({ message: "Listing status updated successfully" });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: error.code || error.message });
// 	}
// };

// export const deleteUserListing = async (req, res) => {
// 	try {
// 		const userId = req.user.id;
// 		const { listingId } = req.params;

// 		const listing = await prisma.listing.findFirst({
// 			where: { id: listingId, ownerId: userId },
// 			include: { owner: true },
// 		});

// 		if (!listing) {
// 			return res.status(404).json({ message: "Listing not found" });
// 		}

// 		if (listing.status === "sold") {
// 			return res.status(400).json({ message: "Sold listing can't be deleted" });
// 		}

// 		if (listing.isCredentialChanged) {
// 			await inngest.send({
// 				name: "app/listing-deleted",
// 				data: { listing, listingId },
// 			});
// 		}

// 		await prisma.listing.update({
// 			where: { id: listingId },
// 			data: { status: "deleted" },
// 		});

// 		return res.json({ message: "Listing deleted successfully" });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.code || error.message });
// 	}
// };

// export const addCredential = async (req, res) => {
// 	try {
// 		const userId = req.user.id;
// 		const { listingId, credential } = req.body;

// 		if (!credential || credential.length === 0 || !listingId) {
// 			return res.status(400).json({ message: "Missing fields" });
// 		}

// 		const listing = await prisma.listing.findFirst({
// 			where: { id: listingId, ownerId: userId },
// 		});

// 		if (!listing) {
// 			return res
// 				.status(404)
// 				.json({ message: "Listing not found or you are not the owner" });
// 		}

// 		await prisma.credential.create({
// 			data: {
// 				listingId,
// 				originalCredential: credential,
// 			},
// 		});

// 		await prisma.listing.update({
// 			where: { id: listingId },
// 			data: { isCredentialSubmitted: true },
// 		});

// 		return res.json({ message: "Credential added successfully" });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.code || error.message });
// 	}
// };

// export const markFeatured = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const userId = req.userId;

// 		if (req.plan !== "premium") {
// 			return res.status(400).json({ message: "Premium plan required" });
// 		}

// 		await prisma.listing.updateMany({
// 			where: { ownerId: userId },
// 			data: { featured: false },
// 		});

// 		await prisma.listing.update({
// 			where: { id },
// 			data: { featured: true },
// 		});

// 		return res.json({ message: "Listing marked as featured successfully" });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.code || error.message });
// 	}
// };

// export const getAllUserOrders = async (req, res) => {
// 	try {
// 		const userId = req.user.id;

// 		let orders = await prisma.transaction.findMany({
// 			where: { userId, isPaid: true },
// 			include: { listing: true },
// 		});

// 		if (!orders || orders.length === 0) {
// 			return res.json({ orders: [] });
// 		}

// 		const credentials = await prisma.credential.findMany({
// 			where: {
// 				listingId: {
// 					in: orders.map((order) => order.listingId),
// 				},
// 			},
// 		});

// 		const ordersWithCredentials = orders.map((order) => {
// 			const credential = credentials.find(
// 				(cred) => cred.listingId === order.listingId,
// 			);
// 			return { ...order, credential };
// 		});

// 		return res.json({ orders: ordersWithCredentials });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.code || error.message });
// 	}
// };

// export const withdrawAmount = async (req, res) => {
// 	try {
// 		const userId = req.user.id;
// 		const { amount, account } = req.body;

// 		const user = await prisma.user.findUnique({
// 			where: { id: userId },
// 		});

// 		if (!user) {
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		const balance = user.earned - user.withdrawn;

// 		if (amount > balance) {
// 			return res.status(400).json({ message: "Insufficient balance" });
// 		}

// 		const withdrawal = await prisma.withdrawal.create({
// 			data: {
// 				userId,
// 				amount,
// 				account,
// 			},
// 		});

// 		await prisma.user.update({
// 			where: { id: userId },
// 			data: {
// 				withdrawn: {
// 					increment: amount,
// 				},
// 			},
// 		});

// 		return res.json({
// 			message: "Applied for withdrawal",
// 			withdrawal,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({
// 			message: error.code || error.message,
// 		});
// 	}
// };

// export const purchaseAccount = async (req, res) => {
// 	try {
// 		const userId = req.user.id;
// 		const { listingId } = req.params;

// 		const { origin } = req.headers;

// 		const listing = await prisma.listing.findFirst({
// 			where: { id: listingId, status: "active" },
// 		});

// 		if (!listing) {
// 			return res
// 				.status(404)
// 				.json({ message: "listing not found or not active" });
// 		}

// 		if (listing.ownerId === userId) {
// 			return res
// 				.status(400)
// 				.json({ message: "You can't purchase your own listing" });
// 		}

// 		const transaction = await prisma.transaction.create({
// 			data: {
// 				listingId,
// 				ownerId: listing.ownerId,
// 				userId,
// 				amount: listing.price,
// 			},
// 		});

// 		const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// 		const session = await stripeInstance.checkout.sessions.create({
// 			success_url: `${origin}/loading/my-orders`,
// 			cancel_url: `${origin}/marketplace`,
// 			line_items: [
// 				{
// 					price_data: {
// 						currency: "INR",
// 						product_data: {
// 							name: `Purchasing Account @${listing.username} of ${listing.platform}`,
// 						},
// 						unit_amount: Math.floor(transaction.amount) * 100,
// 					},
// 					quantity: 1,
// 				},
// 			],
// 			mode: "payment",
// 			metadata: {
// 				transactionId: transaction.id,
// 				appId: "filpearn",
// 			},
// 			expires_at: Math.floor(Date.now() / 1000) + 30 * 60, //expires in 30 min
// 		});

// 		return res.json({ paymentLink: session.url });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.code || error.message });
// 	}
// };
import imageKit from "../configs/imageKit.js";
import fs from "fs";
import validator from "validator";
import prisma from "../configs/prisma.js";

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 2000;
const USERNAME_MAX_LENGTH = 100;

const sanitizeString = (str, maxLength) => {
	if (typeof str !== "string") return str;
	return validator.trim(validator.escape(str)).slice(0, maxLength);
};

const VALID_PLATFORMS = ["youtube", "instagram", "tiktok", "facebook", "twitter", "linkedin", "pinterest", "snapchat", "twitch", "discord"];
const VALID_NICHES = ["lifestyle", "fitness", "food", "travel", "tech", "gaming", "fashion", "beauty", "business", "education", "entertainment", "music", "art", "sports", "health", "finance", "other"];

export const addListing = async (req, res) => {
	try {
		const userId = req.user.id;

		if (!req.body.accountDetails) {
			return res.status(400).json({ message: "Account details are required" });
		}

		let accountDetails;
		try {
			accountDetails = JSON.parse(req.body.accountDetails);
		} catch {
			return res.status(400).json({ message: "Invalid account details format" });
		}

		if (!accountDetails.title || typeof accountDetails.title !== "string" || accountDetails.title.trim().length < 1) {
			return res.status(400).json({ message: "Title is required" });
		}
		accountDetails.title = sanitizeString(accountDetails.title, TITLE_MAX_LENGTH);

		if (!accountDetails.platform || !VALID_PLATFORMS.includes(accountDetails.platform.toLowerCase())) {
			return res.status(400).json({ message: "Valid platform is required" });
		}
		accountDetails.platform = accountDetails.platform.toLowerCase();

		if (!accountDetails.niche || !VALID_NICHES.includes(accountDetails.niche.toLowerCase())) {
			return res.status(400).json({ message: "Valid niche is required" });
		}
		accountDetails.niche = accountDetails.niche.toLowerCase();

		accountDetails.followers_count = parseInt(accountDetails.followers_count);
		if (isNaN(accountDetails.followers_count) || accountDetails.followers_count < 0) {
			return res.status(400).json({ message: "Followers count must be a non-negative number" });
		}

		accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
		if (isNaN(accountDetails.engagement_rate) || accountDetails.engagement_rate < 0) {
			return res.status(400).json({ message: "Engagement rate must be a non-negative number" });
		}

		accountDetails.monthly_views = parseInt(accountDetails.monthly_views);
		if (isNaN(accountDetails.monthly_views) || accountDetails.monthly_views < 0) {
			return res.status(400).json({ message: "Monthly views must be a non-negative number" });
		}

		accountDetails.price = parseInt(accountDetails.price);
		if (isNaN(accountDetails.price) || accountDetails.price <= 0) {
			return res.status(400).json({ message: "Price must be a positive number" });
		}

		if (accountDetails.description) {
			accountDetails.description = sanitizeString(accountDetails.description, DESCRIPTION_MAX_LENGTH);
		}

		if (accountDetails.username) {
			accountDetails.username = accountDetails.username.startsWith("@")
				? sanitizeString(accountDetails.username.slice(1), USERNAME_MAX_LENGTH)
				: sanitizeString(accountDetails.username, USERNAME_MAX_LENGTH);
		}

		const uploadImages = req.files.map(async (file) => {
			const response = await imageKit.files.upload({
				file: fs.createReadStream(file.path),
				fileName: `${Date.now()}.png`,
				folder: "filp-earn",
				transformation: { pre: "w-1280,h-auto" },
			});
			return response.url;
		});

		const images = await Promise.all(uploadImages);

		// FIX: Delete temp files from disk after uploading to ImageKit.
		// Multer writes files to disk before upload. Without cleanup these
		// accumulate and leak disk space on the server.
		req.files.forEach((file) => {
			fs.unlink(file.path, (err) => {
				if (err) console.error("Failed to delete temp file:", file.path, err);
			});
		});

		const listing = await prisma.listing.create({
			data: {
				ownerId: userId,
				images,
				...accountDetails,
			},
		});
		return res
			.status(201)
			.json({ message: "Account Listed successfully", listing });
	} catch (error) {
		res.status(500).json({ message: "Failed to create listing" });
	}
};

export const getAllPublicListings = async (req, res) => {
	try {
		// FIX: Added pagination support (page & limit query params).
		// Without this, the query returns ALL active listings in one shot.
		// As the table grows this becomes a serious performance problem.
		// Default: page=1, limit=20. Clients can pass ?page=2&limit=20.
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const limit = Math.min(100, parseInt(req.query.limit) || 20);
		const skip = (page - 1) * limit;

		const [listings, total] = await Promise.all([
			prisma.listing.findMany({
				where: { status: "active" },
				include: { owner: true },
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.listing.count({ where: { status: "active" } }),
		]);

		return res.json({
			listings: listings || [],
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch listings" });
	}
};

export const getAllUserListing = async (req, res) => {
	try {
		const userId = req.user.id;

		const listings = await prisma.listing.findMany({
			where: { ownerId: userId, status: { not: "deleted" } },
			orderBy: { createdAt: "desc" },
		});

		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		// User might not exist in DB yet (e.g. just signed up via Clerk)
		const balance = user
			? {
					earned: user.earned,
					withdrawn: user.withdrawn,
					available: user.earned - user.withdrawn,
				}
			: { earned: 0, withdrawn: 0, available: 0 };

		return res.json({ listings: listings || [], balance });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.code || error.message });
	}
};

// FIX: Added a public single-listing endpoint so the frontend can fetch
// a listing by ID directly (e.g. when a user opens a shared link and
// the Redux store is empty). Without this the detail page spins forever.
export const getListingById = async (req, res) => {
	try {
		const { listingId } = req.params;

		const listing = await prisma.listing.findFirst({
			where: { id: listingId, status: "active" },
			include: { owner: true },
		});

		if (!listing) {
			return res.status(404).json({ message: "Listing not found" });
		}

		return res.json({ listing });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch listing" });
	}
};

export const updateListing = async (req, res) => {
	try {
		const userId = req.user.id;
		const { id } = req.params;

		if (!req.body.accountDetails) {
			return res.status(400).json({ message: "Account details are required" });
		}

		let accountDetails;
		try {
			accountDetails = JSON.parse(req.body.accountDetails);
		} catch {
			return res.status(400).json({ message: "Invalid account details format" });
		}

		if (req.files.length + (accountDetails.images?.length || 0) > 5) {
			return res.status(400).json({ message: "You can only upload up to 5 images" });
		}

		if (accountDetails.title) {
			accountDetails.title = sanitizeString(accountDetails.title, TITLE_MAX_LENGTH);
		}
		if (accountDetails.platform) {
			if (!VALID_PLATFORMS.includes(accountDetails.platform.toLowerCase())) {
				return res.status(400).json({ message: "Invalid platform" });
			}
			accountDetails.platform = accountDetails.platform.toLowerCase();
		}
		if (accountDetails.niche) {
			if (!VALID_NICHES.includes(accountDetails.niche.toLowerCase())) {
				return res.status(400).json({ message: "Invalid niche" });
			}
			accountDetails.niche = accountDetails.niche.toLowerCase();
		}

		if (accountDetails.followers_count !== undefined) {
			accountDetails.followers_count = parseInt(accountDetails.followers_count);
			if (isNaN(accountDetails.followers_count) || accountDetails.followers_count < 0) {
				return res.status(400).json({ message: "Followers count must be a non-negative number" });
			}
		}
		if (accountDetails.engagement_rate !== undefined) {
			accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
			if (isNaN(accountDetails.engagement_rate) || accountDetails.engagement_rate < 0) {
				return res.status(400).json({ message: "Engagement rate must be a non-negative number" });
			}
		}
		if (accountDetails.monthly_views !== undefined) {
			accountDetails.monthly_views = parseInt(accountDetails.monthly_views);
			if (isNaN(accountDetails.monthly_views) || accountDetails.monthly_views < 0) {
				return res.status(400).json({ message: "Monthly views must be a non-negative number" });
			}
		}
		if (accountDetails.price !== undefined) {
			accountDetails.price = parseInt(accountDetails.price);
			if (isNaN(accountDetails.price) || accountDetails.price <= 0) {
				return res.status(400).json({ message: "Price must be a positive number" });
			}
		}

		if (accountDetails.description) {
			accountDetails.description = sanitizeString(accountDetails.description, DESCRIPTION_MAX_LENGTH);
		}

		accountDetails.username = accountDetails.username
			? sanitizeString(accountDetails.username.replace(/^@/, ""), USERNAME_MAX_LENGTH)
			: "";

		const existingListing = await prisma.listing.findFirst({
			where: { id, ownerId: userId },
		});

		if (!existingListing) {
			return res.status(404).json({ message: "Listing not found" });
		}

		if (existingListing.status === "sold") {
			return res
				.status(400)
				.json({ message: "You can't update sold listings" });
		}

		let newImages = [];
		if (req.files.length > 0) {
			const uploadImages = req.files.map((file) =>
				imageKit.files.upload({
					file: fs.createReadStream(file.path),
					fileName: `${Date.now()}.png`,
					folder: "filp-earn",
					transformation: { pre: "w-1280,h-auto" },
				}),
			);

			let uploadedResults;
			try {
				uploadedResults = await Promise.all(uploadImages);
				newImages = uploadedResults.map((r) => r.url);
			} catch (uploadError) {
				// FIX: Clean up temp files even when the ImageKit upload fails,
				// then surface the error — don't leave orphaned temp files behind.
				req.files.forEach((file) => {
					fs.unlink(file.path, () => {});
				});
				throw uploadError;
			}

			// FIX: Clean up temp files after successful upload (same leak as addListing).
			req.files.forEach((file) => {
				fs.unlink(file.path, (err) => {
					if (err) console.error("Failed to delete temp file:", file.path, err);
				});
			});
		}

		const updatedListing = await prisma.listing.update({
			where: { id, ownerId: userId },
			data: {
				...accountDetails,
				images: [...(accountDetails.images || []), ...newImages],
			},
		});

		return res.json({
			message: "Account Updated successfully",
			listing: updatedListing,
		});
	} catch (error) {
		return res.status(500).json({ message: "Failed to update listing" });
	}
};

export const toggleStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;
		const { status } = req.body; // Allow explicit status from frontend

		const listing = await prisma.listing.findFirst({
			where: { id, ownerId: userId },
		});
		if (!listing) {
			return res.status(404).json({ message: "Listing not found" });
		}

		if (listing.status === "ban") {
			return res.status(400).json({ message: "Your listing is banned" });
		} else if (listing.status === "sold") {
			return res.status(400).json({ message: "Your listing is sold" });
		}

		// If explicit status provided (e.g., "sold"), use it; otherwise toggle
		const newStatus = status || (listing.status === "active" ? "inactive" : "active");

		// If marking as sold, credit the seller's earned balance
		if (newStatus === "sold" && listing.status !== "sold") {
			await prisma.$transaction(async (tx) => {
				await tx.listing.update({
					where: { id },
					data: { status: "sold" },
				});

				await tx.user.update({
					where: { id: userId },
					data: { earned: { increment: listing.price } },
				});
			});
		} else {
			await prisma.listing.update({
				where: { id },
				data: { status: newStatus },
			});
		}

		return res.json({ message: "Listing status updated successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to update listing status" });
	}
};

export const deleteUserListing = async (req, res) => {
	try {
		const userId = req.user.id;
		const { listingId } = req.params;

		const listing = await prisma.listing.findFirst({
			where: { id: listingId, ownerId: userId },
			include: { owner: true },
		});

		if (!listing) {
			return res.status(404).json({ message: "Listing not found" });
		}

		if (listing.status === "sold") {
			return res.status(400).json({ message: "Sold listing can't be deleted" });
		}

		await prisma.listing.update({
			where: { id: listingId },
			data: { status: "deleted" },
		});

		return res.json({ message: "Listing deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to delete listing" });
	}
};

export const addCredential = async (req, res) => {
	try {
		const userId = req.user.id;
		const { listingId, credential } = req.body;

		if (!credential || credential.length === 0 || !listingId) {
			return res.status(400).json({ message: "Missing fields" });
		}

		const listing = await prisma.listing.findFirst({
			where: { id: listingId, ownerId: userId },
		});

		if (!listing) {
			return res
				.status(404)
				.json({ message: "Listing not found or you are not the owner" });
		}

		await prisma.credential.create({
			data: {
				listingId,
				originalCredential: credential,
			},
		});

		await prisma.listing.update({
			where: { id: listingId },
			data: { isCredentialSubmitted: true },
		});

		return res.json({ message: "Credential added successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to add credential" });
	}
};

export const markFeatured = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		const listing = await prisma.listing.findFirst({
			where: { id, ownerId: userId },
		});

		if (!listing) {
			return res.status(404).json({ message: "Listing not found" });
		}

		await prisma.listing.updateMany({
			where: { ownerId: userId },
			data: { featured: false },
		});

		await prisma.listing.update({
			where: { id },
			data: { featured: true },
		});

		return res.json({ message: "Listing marked as featured successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to mark listing as featured" });
	}
};

export const getAllUserOrders = async (req, res) => {
	try {
		const userId = req.user.id;

		let orders = await prisma.transaction.findMany({
			where: { userId, isPaid: true },
			include: { listing: true },
		});

		if (!orders || orders.length === 0) {
			return res.json({ orders: [] });
		}

		const credentials = await prisma.credential.findMany({
			where: {
				listingId: {
					in: orders.map((order) => order.listingId),
				},
			},
		});

		const ordersWithCredentials = orders.map((order) => {
			const credential = credentials.find(
				(cred) => cred.listingId === order.listingId,
			);
			return { ...order, credential };
		});

		return res.json({ orders: ordersWithCredentials });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch orders" });
	}
};

export const withdrawAmount = async (req, res) => {
	try {
		const userId = req.user.id;
		const { amount, account } = req.body;

		// FIX: Wrap the balance check + withdrawal in a Prisma transaction
		// to prevent a race condition. Without this, two concurrent requests
		// can both pass the balance check before either updates user.withdrawn,
		// allowing the user to overdraw their balance.
		let withdrawal;
		await prisma.$transaction(async (tx) => {
			const user = await tx.user.findUnique({
				where: { id: userId },
			});

			if (!user) {
				throw new Error("User not found");
			}

			const balance = user.earned - user.withdrawn;

			if (amount > balance) {
				throw new Error("Insufficient balance");
			}

			withdrawal = await tx.withdrawal.create({
				data: {
					userId,
					amount,
					account,
				},
			});

			await tx.user.update({
				where: { id: userId },
				data: {
					withdrawn: {
						increment: amount,
					},
				},
			});
		});

		return res.json({
			message: "Applied for withdrawal",
			withdrawal,
		});
	} catch (error) {
		const isClientError =
			error.message === "Insufficient balance" ||
			error.message === "User not found";
		res
			.status(isClientError ? 400 : 500)
			.json({ message: isClientError ? error.message : "Failed to process withdrawal" });
	}
};

export const purchaseAccount = async (req, res) => {
	try {
		const userId = req.user.id;
		const { listingId } = req.params;

		const listing = await prisma.listing.findFirst({
			where: { id: listingId, status: "active" },
		});

		if (!listing) {
			return res
				.status(404)
				.json({ message: "listing not found or not active" });
		}

		if (listing.ownerId === userId) {
			return res
				.status(400)
				.json({ message: "You can't purchase your own listing" });
		}

		const transaction = await prisma.transaction.create({
			data: {
				listingId,
				ownerId: listing.ownerId,
				userId,
				amount: listing.price,
			},
		});

		// Mark transaction as paid, update listing to sold, and credit seller earnings
		// All in a single atomic DB transaction to prevent partial updates
		await prisma.$transaction(async (tx) => {
			await tx.transaction.update({
				where: { id: transaction.id },
				data: { isPaid: true },
			});

			await tx.listing.update({
				where: { id: listingId },
				data: { status: "sold" },
			});

			// FIX: Credit the listing owner's earned balance.
			// This was the root cause of Earned/Available always showing $0.
			await tx.user.update({
				where: { id: listing.ownerId },
				data: { earned: { increment: listing.price } },
			});
		});

		return res.json({
			message: "Purchase successful",
			transactionId: transaction.id,
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to process purchase" });
	}
};

export const getUserWithdrawals = async (req, res) => {
	try {
		const userId = req.user.id;

		const withdrawals = await prisma.withdrawal.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});

		return res.json({ withdrawals: withdrawals || [] });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch withdrawals" });
	}
};
