import crypto from "crypto";
import razorpay from "../configs/razorpay.js";
import prisma from "../configs/prisma.js";

const PLAN_AMOUNTS = {
	BASIC: 29900,
	PREMIUM: 99900,
};

const PLAN_DURATIONS = {
	BASIC: 30,
	PREMIUM: 30,
};

export const createOrder = async (req, res) => {
	try {
		const { plan } = req.body;

		if (!plan || !["BASIC", "PREMIUM"].includes(plan)) {
			return res.status(400).json({ message: "Invalid plan selected" });
		}

		const amount = PLAN_AMOUNTS[plan];

		const order = await razorpay.orders.create({
			amount,
			currency: "INR",
			receipt: `plan_${Date.now()}`,
		});

		res.status(200).json({
			orderId: order.id,
			amount: order.amount,
			currency: order.currency,
			keyId: process.env.RAZORPAY_KEY_ID,
		});
	} catch (error) {
		console.error("Create order error:", error);
		res.status(500).json({ message: "Failed to create payment order" });
	}
};

export const verifyPayment = async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
			req.body;

		if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
			return res.status(400).json({ message: "Missing payment details" });
		}

		const body = razorpay_order_id + "|" + razorpay_payment_id;

		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(body)
			.digest("hex");

		if (expectedSignature !== razorpay_signature) {
			return res.status(400).json({ message: "Invalid payment signature" });
		}

		const duration = PLAN_DURATIONS[plan] || 30;
		const endDate = new Date();
		endDate.setDate(endDate.getDate() + duration);

		await prisma.plan.create({
			data: {
				userId: req.user.id,
				plan,
				razorpayOrderId: razorpay_order_id,
				razorpayPaymentId: razorpay_payment_id,
				razorpaySignature: razorpay_signature,
				amount: PLAN_AMOUNTS[plan] / 100,
				endDate,
				isActive: true,
			},
		});

		await prisma.user.update({
			where: { id: req.user.id },
			data: { plan },
		});

		res.status(200).json({ message: "Payment verified and plan activated" });
	} catch (error) {
		console.error("Verify payment error:", error);
		res.status(500).json({ message: "Payment verification failed" });
	}
};

export const getCurrentPlan = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: { plan: true },
		});

		const activePlan = await prisma.plan.findFirst({
			where: {
				userId: req.user.id,
				isActive: true,
			},
			orderBy: { createdAt: "desc" },
		});

		res.status(200).json({
			plan: user.plan,
			planDetails: activePlan || null,
		});
	} catch (error) {
		console.error("Get plan error:", error);
		res.status(500).json({ message: "Failed to fetch plan" });
	}
};

export const downgradePlan = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: { plan: true },
		});

		if (user.plan === "FREE") {
			return res.status(400).json({ message: "Already on Free plan" });
		}

		await prisma.plan.updateMany({
			where: {
				userId: req.user.id,
				isActive: true,
			},
			data: { isActive: false },
		});

		await prisma.user.update({
			where: { id: req.user.id },
			data: { plan: "FREE" },
		});

		res.status(200).json({ message: "Downgraded to Free plan" });
	} catch (error) {
		console.error("Downgrade plan error:", error);
		res.status(500).json({ message: "Failed to downgrade plan" });
	}
};
