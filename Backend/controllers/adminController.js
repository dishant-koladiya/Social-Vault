import prisma from "../configs/prisma.js";

export const isAdmin = async (req, res) => {
	try {
		return res.json({ isAdmin: true, role: req.user.role });
	} catch (error) {
		res.status(500).json({ message: "Failed to check admin status" });
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
		res.status(500).json({ message: "Failed to fetch dashboard data" });
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
		res.status(500).json({ message: "Failed to fetch listings" });
	}
};

const VALID_STATUSES = ["active", "ban", "sold", "deleted", "inactive"];

export const changeStatus = async (req, res) => {
	try {
		const { listingId } = req.params;
		const { status } = req.body;

		if (!status || !VALID_STATUSES.includes(status)) {
			return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
		}

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
		res.status(500).json({ message: "Failed to update listing status" });
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
		res.status(500).json({ message: "Failed to fetch unverified listings" });
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
		res.status(500).json({ message: "Failed to fetch credential" });
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
		res.status(500).json({ message: "Failed to verify credential" });
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
		res.status(500).json({ message: "Failed to fetch listings" });
	}
};

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
			where: { id: credentialId },
			data: { updatedCredential: newCredential },
		});

		await prisma.listing.update({
			where: { id: listingId },
			data: { isCredentialChanged: true },
		});

		return res.json({ message: "Credential Changed Successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to change credential" });
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
		res.status(500).json({ message: "Failed to fetch transactions" });
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
		res.status(500).json({ message: "Failed to fetch withdrawal requests" });
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
		res.status(500).json({ message: "Failed to update withdrawal" });
	}
};

export const rejectWithdrawal = async (req, res) => {
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
				.json({ message: "Cannot reject an already paid withdrawal" });
		}

		if (withdrawal.isRejected) {
			return res
				.status(400)
				.json({ message: "Withdrawal already rejected" });
		}

		// Reject and reverse the withdrawn amount atomically
		await prisma.$transaction(async (tx) => {
			await tx.withdrawal.update({
				where: { id },
				data: { isRejected: true },
			});

			// Restore the user's withdrawn balance so available is recalculated correctly
			await tx.user.update({
				where: { id: withdrawal.userId },
				data: {
					withdrawn: { decrement: withdrawal.amount },
				},
			});
		});

		return res.json({ message: "Withdrawal rejected and balance restored" });
	} catch (error) {
		res.status(500).json({ message: "Failed to reject withdrawal" });
	}
};
