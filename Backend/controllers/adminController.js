// import prisma from "../configs/prisma.js";

// export const isAdmin = async (req, res) => {
// 	try {
// 		return res.json({ isAdmin: true });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //controller for getting dashboard data
// export const getDashboard = async (req, res) => {
// 	try {
// 		const totalListing = await prisma.listing.count({});
// 		const transactions = await prisma.transaction.findMany({
// 			where: { isPaid: true },
// 			select: { amount: true },
// 		});

// 		const totalRevenue = transactions.reduce(
// 			(total, transaction) => total + transaction.amount,
// 			0,
// 		);

// 		const activeListings = await prisma.listing.count({
// 			where: { status: "active" },
// 		});

// 		const totalUser = await prisma.user.count({});
// 		const recentListings = await prisma.listing.findMany({
// 			orderBy: { createdAt: "desc" },
// 			take: 5,
// 			include: { owner: true },
// 		});

// 		return res.json({
// 			dashboardData: {
// 				totalListing: totalListing,
// 				totalRevenue,
// 				activeListings,
// 				totalUser,
// 				recentListings,
// 			},
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //controller for getting all listing
// export const getAllListings = async (req, res) => {
// 	try {
// 		const listings = await prisma.listing.findMany({
// 			include: { owner: true },
// 			orderBy: { createdAt: "desc" },
// 		});

// 		if (!listings || listings.length === 0) {
// 			return res.json({ listings: [] });
// 		}
// 		return res.json({ listings });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //change listing status
// export const changeStatus = async (req, res) => {
// 	try {
// 		const { listingId } = req.params;
// 		const { status } = req.body;

// 		const listing = await prisma.listing.findUnique({
// 			where: { id: listingId },
// 		});

// 		if (!listing) {
// 			return res.status(404).json({ message: "Listing not found" });
// 		}

// 		await prisma.listing.update({
// 			where: { id: listingId },
// 			data: { status },
// 		});

// 		// ✅ Added missing response
// 		return res.json({ message: "Listing status updated successfully" });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //controller for getting all unverified listings with credential submitted
// export const getAllUnverifiedListings = async (req, res) => {
// 	try {
// 		const listings = await prisma.listing.findMany({
// 			where: {
// 				isCredentialSubmitted: true,
// 				isCredentialVerified: false,
// 				status: { not: "deleted" },
// 			},
// 			orderBy: { createdAt: "desc" },
// 		});

// 		if (!listings || listings.length === 0) {
// 			return res.json({ listings: [] });
// 		}

// 		return res.json({ listings });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //controller for getting credential
// export const getCredential = async (req, res) => {
// 	try {
// 		const { listingId } = req.params;

// 		// ✅ Fixed: was `where: listingId` (invalid), now correct prisma where clause
// 		const credential = await prisma.credential.findFirst({
// 			where: { listingId },
// 		});

// 		if (!credential) {
// 			return res.status(404).json({ message: "Credential not found" });
// 		}

// 		return res.json({ credential });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //mark credential as verified
// export const markCredentialVerified = async (req, res) => {
// 	try {
// 		const { listingId } = req.params;

// 		await prisma.listing.update({
// 			where: { id: listingId },
// 			data: { isCredentialVerified: true },
// 		});

// 		return res.json({ message: "Credential marked as verified" });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //get all un-changed listings
// export const getAllUnChangedListings = async (req, res) => {
// 	try {
// 		const listings = await prisma.listing.findMany({
// 			where: {
// 				isCredentialVerified: true,
// 				isCredentialChanged: false,
// 				status: { not: "deleted" },
// 			},
// 			orderBy: { createdAt: "desc" },
// 		});

// 		if (!listings || listings.length === 0) {
// 			return res.json({ listings: [] });
// 		}

// 		return res.json({ listings });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //change credential for verified listing
// export const ChangeCredential = async (req, res) => {
// 	try {
// 		const { listingId } = req.params;
// 		const { newCredential, credentialId } = req.body;

// 		await prisma.credential.update({
// 			where: { id: credentialId, listingId },
// 			data: { updatedCredential: newCredential },
// 		});

// 		await prisma.listing.update({
// 			where: { id: listingId },
// 			data: { isCredentialChanged: true },
// 		});

// 		return res.json({ message: "Credential Changed Successfully" });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //get all transactions
// export const getAllTransactions = async (req, res) => {
// 	try {
// 		const transactions = await prisma.transaction.findMany({
// 			where: { isPaid: true },
// 			orderBy: { createdAt: "desc" },
// 			include: { listing: { include: { owner: true } } },
// 		});

// 		// ✅ Moved empty check BEFORE processing to avoid unnecessary work
// 		if (!transactions || transactions.length === 0) {
// 			return res.json({ transactions: [] });
// 		}

// 		const customers = await prisma.user.findMany({
// 			where: { id: { in: transactions.map((t) => t.userId) } },
// 			select: { id: true, email: true, name: true, image: true },
// 		});

// 		// ✅ Fixed: was mutating read-only Prisma objects directly;
// 		// now returns a new mapped array instead
// 		const transactionsWithCustomers = transactions.map((t) => {
// 			const customer = customers.find((c) => c.id === t.userId);
// 			return {
// 				...t,
// 				listing: {
// 					...t.listing,
// 					customer: { ...customer },
// 				},
// 			};
// 		});

// 		return res.json({ transactions: transactionsWithCustomers });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //all withdraw requests
// export const getAllWithdrawRequests = async (req, res) => {
// 	try {
// 		const requests = await prisma.withdrawal.findMany({
// 			orderBy: { createdAt: "desc" },
// 			include: { user: true },
// 		});

// 		if (!requests || requests.length === 0) {
// 			return res.json({ requests: [] });
// 		}

// 		return res.json({ requests });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };

// //marking withdraw as paid
// export const markWithdrawalAsPaid = async (req, res) => {
// 	try {
// 		const { id } = req.params;

// 		const withdrawal = await prisma.withdrawal.findUnique({
// 			where: { id },
// 		});

// 		if (!withdrawal) {
// 			return res.status(400).json({ message: "Withdrawal not found" });
// 		}

// 		if (withdrawal.isWithdrawn) {
// 			return res
// 				.status(400)
// 				.json({ message: "Withdrawal already marked as paid" });
// 		}

// 		await prisma.withdrawal.update({
// 			where: { id },
// 			data: { isWithdrawn: true },
// 		});

// 		return res.json({ message: "Withdrawal marked as paid" });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.code || error.message });
// 	}
// };
import prisma from "../configs/prisma.js";

export const isAdmin = async (req, res) => {
	try {
		return res.json({ isAdmin: true });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

export const getDashboard = async (req, res) => {
	try {
		const totalListing = await prisma.listing.count({});
		const transactions = await prisma.transaction.findMany({
			where: { isPaid: true },
			select: { amount: true },
		});

		const totalRevenue = transactions.reduce(
			(total, transaction) => total + transaction.amount,
			0,
		);

		const activeListings = await prisma.listing.count({
			where: { status: "active" },
		});

		const totalUser = await prisma.user.count({});
		const recentListings = await prisma.listing.findMany({
			orderBy: { createdAt: "desc" },
			take: 5,
			include: { owner: true },
		});

		return res.json({
			dashboardData: {
				totalListing,
				totalRevenue,
				activeListings,
				totalUser,
				recentListings,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

export const getAllListings = async (req, res) => {
	try {
		const listings = await prisma.listing.findMany({
			include: { owner: true },
			orderBy: { createdAt: "desc" },
		});

		return res.json({ listings: listings || [] });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

export const changeStatus = async (req, res) => {
	try {
		const { listingId } = req.params;
		const { status } = req.body;

		const listing = await prisma.listing.findUnique({
			where: { id: listingId },
		});

		if (!listing) {
			return res.status(404).json({ message: "Listing not found" });
		}

		await prisma.listing.update({
			where: { id: listingId },
			data: { status },
		});

		return res.json({ message: "Listing status updated successfully" });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

export const getAllUnverifiedListings = async (req, res) => {
	try {
		const listings = await prisma.listing.findMany({
			where: {
				isCredentialSubmitted: true,
				isCredentialVerified: false,
				status: { not: "deleted" },
			},
			orderBy: { createdAt: "desc" },
		});

		return res.json({ listings: listings || [] });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

export const getCredential = async (req, res) => {
	try {
		const { listingId } = req.params;

		const credential = await prisma.credential.findFirst({
			where: { listingId },
		});

		if (!credential) {
			return res.status(404).json({ message: "Credential not found" });
		}

		return res.json({ credential });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

export const markCredentialVerified = async (req, res) => {
	try {
		const { listingId } = req.params;

		await prisma.listing.update({
			where: { id: listingId },
			data: { isCredentialVerified: true },
		});

		return res.json({ message: "Credential marked as verified" });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

export const getAllUnChangedListings = async (req, res) => {
	try {
		const listings = await prisma.listing.findMany({
			where: {
				isCredentialVerified: true,
				isCredentialChanged: false,
				status: { not: "deleted" },
			},
			orderBy: { createdAt: "desc" },
		});

		return res.json({ listings: listings || [] });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

// ✅ FIX: validate credentialId, use id alone in where clause
export const ChangeCredential = async (req, res) => {
	try {
		const { listingId } = req.params;
		const { newCredential, credentialId } = req.body;

		if (!credentialId) {
			return res.status(400).json({ message: "credentialId is required" });
		}

		const credential = await prisma.credential.findFirst({
			where: { id: credentialId, listingId },
		});

		if (!credential) {
			return res
				.status(404)
				.json({ message: "Credential not found for this listing" });
		}

		await prisma.credential.update({
			where: { id: credentialId }, // ✅ id alone — it's unique
			data: { updatedCredential: newCredential },
		});

		await prisma.listing.update({
			where: { id: listingId },
			data: { isCredentialChanged: true },
		});

		return res.json({ message: "Credential Changed Successfully" });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

export const getAllTransactions = async (req, res) => {
	try {
		const transactions = await prisma.transaction.findMany({
			where: { isPaid: true },
			orderBy: { createdAt: "desc" },
			include: { listing: { include: { owner: true } } },
		});

		if (!transactions || transactions.length === 0) {
			return res.json({ transactions: [] });
		}

		const customers = await prisma.user.findMany({
			where: { id: { in: transactions.map((t) => t.userId) } },
			select: { id: true, email: true, name: true, image: true },
		});

		const transactionsWithCustomers = transactions.map((t) => {
			const customer = customers.find((c) => c.id === t.userId);
			return {
				...t,
				listing: {
					...t.listing,
					customer: customer || null,
				},
			};
		});

		return res.json({ transactions: transactionsWithCustomers });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

export const getAllWithdrawRequests = async (req, res) => {
	try {
		const requests = await prisma.withdrawal.findMany({
			orderBy: { createdAt: "desc" },
			include: { user: true },
		});

		return res.json({ requests: requests || [] });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};

export const markWithdrawalAsPaid = async (req, res) => {
	try {
		const { id } = req.params;

		const withdrawal = await prisma.withdrawal.findUnique({
			where: { id },
		});

		if (!withdrawal) {
			return res.status(404).json({ message: "Withdrawal not found" });
		}

		if (withdrawal.isWithdrawn) {
			return res
				.status(400)
				.json({ message: "Withdrawal already marked as paid" });
		}

		await prisma.withdrawal.update({
			where: { id },
			data: { isWithdrawn: true },
		});

		return res.json({ message: "Withdrawal marked as paid" });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.code || error.message });
	}
};
