import React, { useState } from "react";
import { CheckIcon, X } from "lucide-react";

const plans = [
	{
		name: "Free",
		price: "₹0",
		features: ["5 Listings", "Basic analytics", "Community support"],
	},
	{
		name: "Basic",
		price: "₹299",
		features: [
			"25 Listings",
			"Advanced analytics",
			"Priority support",
			"Featured listing",
		],
	},
	{
		name: "Premium",
		price: "₹999",
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

const DUMMY_QR_URL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=dummy@upi&pn=MarketPlace&amount=0&cu=INR";

const Plans = () => {
	const [selectedPlan, setSelectedPlan] = useState(null);

	const handleChoosePlan = (plan) => {
		if (plan.name === "Free") return;
		setSelectedPlan(plan);
	};

	const handleCloseQR = () => {
		setSelectedPlan(null);
	};

	return (
		<div className="max-w-5xl mx-auto z-20 my-30 max-md:px-4">
			<div className="text-center">
				<h2 className="text-gray-700 text-4xl font-semibold">
					Choose Your Plan
				</h2>
				<p className="text-gray-500 text-sm max-w-md mx-auto">
					Start for free and scale up as you grow. Find the perfect plan for
					your content creation needs.
				</p>
			</div>

			<div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
				{plans.map((plan) => (
					<div
						key={plan.name}
						className="border border-gray-200 rounded-2xl p-6 flex flex-col"
					>
						<h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
						<p className="text-3xl font-bold mt-2">{plan.price}</p>
						<div className="mt-6 space-y-3 flex-1">
							{plan.features.map((feature) => (
								<div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
									<CheckIcon size={16} className="text-green-500 shrink-0" />
									{feature}
								</div>
							))}
						</div>
						<button
							onClick={() => handleChoosePlan(plan)}
							className="mt-6 w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-medium transition cursor-pointer"
						>
							Get {plan.name}
						</button>
					</div>
				))}
			</div>

			{selectedPlan && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleCloseQR}>
					<div className="bg-white rounded-2xl p-8 max-w-sm w-full flex flex-col items-center gap-4 relative" onClick={(e) => e.stopPropagation()}>
						<button
							onClick={handleCloseQR}
							className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
						>
							<X size={20} />
						</button>
						<h3 className="text-lg font-semibold text-gray-800">Pay for {selectedPlan.name} Plan</h3>
						<p className="text-sm text-gray-500">Scan the QR code to complete payment</p>
						<img
							src={DUMMY_QR_URL}
							alt="Payment QR Code"
							className="w-48 h-48 rounded-lg border"
						/>
						<p className="text-2xl font-bold text-indigo-600">{selectedPlan.price}</p>
						<p className="text-xs text-gray-400">UPI • Paytm • PhonePe • GPay</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Plans;
