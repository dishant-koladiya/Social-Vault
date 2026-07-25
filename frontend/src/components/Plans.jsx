import React, { useEffect, useState, useRef } from "react";
import { CheckIcon, Loader2, X, Smartphone, CreditCard } from "lucide-react";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
	createOrder,
	verifyPayment,
	fetchCurrentPlan,
	downgradePlan,
} from "../app/features/planSlice";

const UPI_NUMBER = "7984491528";
const UPI_NAME = "SocialVault";

const plans = [
	{
		name: "Free",
		planKey: "FREE",
		price: 0,
		priceLabel: "₹0",
		features: ["5 Listings", "Basic analytics", "Community support"],
	},
	{
		name: "Basic",
		planKey: "BASIC",
		price: 299,
		priceLabel: "₹299",
		features: [
			"25 Listings",
			"Advanced analytics",
			"Priority support",
			"Featured listing",
		],
	},
	{
		name: "Premium",
		planKey: "PREMIUM",
		price: 999,
		priceLabel: "₹999",
		features: [
			"Unlimited Listings",
			"Premium analytics",
			"24/7 support",
			"Featured listings",
			"Verified badge",
			"No commission",
		],
	},
];

const Plans = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { plan: currentPlan } = useSelector((state) => state.plan);
	const [paying, setPaying] = useState(null);
	const [showUPI, setShowUPI] = useState(null);
	const [qrDataUrl, setQrDataUrl] = useState("");
	const qrTimeoutRef = useRef(null);

	useEffect(() => {
		if (user) {
			dispatch(fetchCurrentPlan());
		}
	}, [user, dispatch]);

	useEffect(() => {
		return () => {
			if (qrTimeoutRef.current) clearTimeout(qrTimeoutRef.current);
		};
	}, []);

	const generateQR = async (plan) => {
		const upiLink = `upi://pay?pa=${UPI_NUMBER}@upi&pn=${UPI_NAME}&am=${plan.price}&cu=INR`;
		try {
			const url = await QRCode.toDataURL(upiLink, {
				width: 256,
				margin: 2,
				color: { dark: "#1e1b4b", light: "#ffffff" },
			});
			setQrDataUrl(url);
			setShowUPI(plan);
		} catch {
			toast.error("Failed to generate QR code");
		}
	};

	const handleChoosePlan = async (plan) => {
		if (!user) {
			navigate("/login");
			return;
		}

		if (plan.planKey === "FREE") {
			if (currentPlan === "FREE") return;
			try {
				await dispatch(downgradePlan()).unwrap();
				toast.success("Downgraded to Free plan");
				dispatch(fetchCurrentPlan());
			} catch (err) {
				toast.error(err || "Failed to downgrade");
			}
			return;
		}

		if (currentPlan === plan.planKey) return;

		setPaying(plan.planKey);

		try {
			const orderData = await dispatch(
				createOrder({ plan: plan.planKey }),
			).unwrap();

			const options = {
				key: orderData.keyId,
				amount: orderData.amount,
				currency: orderData.currency,
				name: "Social Profile Marketplace",
				description: `${plan.name} Plan Subscription`,
				order_id: orderData.orderId,
				handler: async (response) => {
					try {
						await dispatch(
							verifyPayment({
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature,
								plan: plan.planKey,
							}),
						).unwrap();
						toast.success(`${plan.name} plan activated!`);
						dispatch(fetchCurrentPlan());
					} catch {
						toast.error("Payment verification failed");
					} finally {
						setPaying(null);
					}
				},
				prefill: {
					name: user.name || "",
					email: user.email || "",
				},
				theme: { color: "#4f46e5" },
				modal: { ondismiss: () => setPaying(null) },
			};

			const rzp = new window.Razorpay(options);
			rzp.open();
		} catch {
			toast.error("Failed to initiate payment");
			setPaying(null);
		}
	};

	const getButtonLabel = (plan) => {
		if (currentPlan === plan.planKey) return "Current Plan";
		if (plan.planKey === "FREE") return "Downgrade";
		if (paying === plan.planKey) return "Processing...";
		return `Get ${plan.name}`;
	};

	const isDisabled = (plan) => {
		if (currentPlan === plan.planKey) return true;
		if (paying && paying !== plan.planKey) return true;
		return false;
	};

	return (
		<div className="max-w-5xl mx-auto z-20 my-30 max-md:px-4">
			<div className="text-center">
				<h2 className="text-gray-700 text-4xl font-semibold">
					Choose Your Plan
				</h2>
				<p className="text-gray-500 text-sm max-w-md mx-auto mt-3">
					Start for free and scale up as you grow.
				</p>
			</div>

			<div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
				{plans.map((plan) => {
					const isActive = currentPlan === plan.planKey;
					const isPaying = paying === plan.planKey;
					const isFree = plan.planKey === "FREE";

					return (
						<div
							key={plan.name}
							className={`border rounded-xl p-6 flex flex-col bg-white ${
								isActive
									? "border-indigo-400 shadow-md shadow-indigo-100"
									: "border-gray-200"
							}`}
						>
							<h3 className="text-lg font-medium text-gray-800">
								{plan.name}
							</h3>
							<p className="text-3xl font-bold mt-1 text-gray-900">
								{plan.priceLabel}
								{!isFree && (
									<span className="text-sm font-normal text-gray-400">
										/mo
									</span>
								)}
							</p>

							<div className="mt-5 space-y-2.5 flex-1">
								{plan.features.map((feature) => (
									<div
										key={feature}
										className="flex items-center gap-2 text-sm text-gray-500"
									>
										<CheckIcon
											size={14}
											className="text-green-500 shrink-0"
										/>
										{feature}
									</div>
								))}
							</div>

							<div className="mt-5 space-y-2">
								{!isFree && (
									<button
										onClick={() => generateQR(plan)}
										disabled={isDisabled(plan)}
										className={`w-full py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 border ${
											isActive
												? "border-gray-200 text-gray-400 bg-gray-50 cursor-default"
												: "border-indigo-200 text-indigo-600 hover:bg-indigo-50 cursor-pointer"
										}`}
									>
										<Smartphone size={14} />
										Pay via UPI
									</button>
								)}
								<button
									onClick={() => handleChoosePlan(plan)}
									disabled={isDisabled(plan)}
									className={`w-full py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
										isActive
											? "bg-gray-100 text-gray-400 cursor-default"
											: "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
									}`}
								>
									{isPaying && (
										<Loader2 size={14} className="animate-spin" />
									)}
									{!isFree && !isActive && (
										<CreditCard size={14} />
									)}
									{getButtonLabel(plan)}
								</button>
							</div>
						</div>
					);
				})}
			</div>

			{showUPI && (
				<div
					className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
					onClick={() => setShowUPI(null)}
				>
					<div
						className="bg-white rounded-xl p-6 max-w-xs w-full flex flex-col items-center gap-4 relative"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={() => setShowUPI(null)}
							className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
						>
							<X size={18} />
						</button>

						<h3 className="text-base font-semibold text-gray-800">
							Pay {showUPI.priceLabel} via UPI
						</h3>

						{qrDataUrl && (
							<img
								src={qrDataUrl}
								alt="UPI QR Code"
								className="w-52 h-52 rounded-lg border border-gray-100"
							/>
						)}

						<p className="text-xs text-gray-400 text-center">
							Scan with any UPI app to pay
						</p>

						<div className="flex items-center gap-3 text-xs text-gray-500">
							<span>Google Pay</span>
							<span className="text-gray-300">|</span>
							<span>PhonePe</span>
							<span className="text-gray-300">|</span>
							<span>Paytm</span>
						</div>

						<button
							onClick={() => setShowUPI(null)}
							className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Plans;
