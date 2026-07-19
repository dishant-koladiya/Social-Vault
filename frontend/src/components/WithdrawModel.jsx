// import { useAuth } from "@clerk/clerk-react";
import { X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import api from "../configs/axios";
import { getAllUserListing } from "../app/features/listingSlice";

const WithdrawalModal = ({ onClose }) => {
	const dispatch = useDispatch();
	const [amount, setAmount] = useState("");
	const [account, setAccount] = useState([
		{ type: "text", name: "Account Holder Name", value: "" },
		{ type: "text", name: "Bank Name", value: "" },
		{ type: "number", name: "Account Number", value: "" },
		{ type: "text", name: "Account Type", value: "" },
		{ type: "text", name: "SWIFT", value: "" },
		{ type: "text", name: "Branch", value: "" },
	]);

	const handleAccountChange = (index, value) => {
		setAccount((prev) =>
			prev.map((field, i) => (i === index ? { ...field, value } : field)),
		);
	};

	const handleSubmission = async (e) => {
		e.preventDefault();
		try {
			if (account.length === 0) {
				return toast.error("Please add at least one field");
			}
			for (const field of account) {
				if (!field.value) {
					return toast.error(`Please fill in the ${field.name} field`);
				}
			}

			const confirm = window.confirm("Are you sure you want to submit?");
			if (!confirm) return;

			// const token = await getToken();

			const { data } = await api.post(
				"/api/listing/withdraw",
				{ account, amount: parseInt(amount) }
			);
			toast.success(data.message);
			dispatch(getAllUserListing());
			onClose();
		} catch (error) {
			console.log(error);
			toast.error(error?.response?.data?.message || error?.message);
		}
	};

	return (
		<div className="z-[100] mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 fixed  left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col">
				{/* Header */}
				<div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 rounded-t-lg flex items-center justify-between">
					<div>
						<h3 className="font-semibold text-lg">Withdrawal Request</h3>
						<p className="text-sm text-indigo-100">
							s Submit your bank details to withdraw balance
						</p>
					</div>

					<button
						onClick={onClose}
						className="p-1 hover:bg-white/20 rounded-full transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmission} className="flex flex-col gap-4 p-5">
					{/* Amount */}
					<div className="grid grid-cols-[2fr_3fr] items-center gap-2">
						<label className="text-sm font-medium text-gray-800">Amount</label>

						<input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
							required
						/>
					</div>

					{/* Bank Fields */}
					{account.map((field, index) => (
						<div
							key={index}
							className="grid grid-cols-[2fr_3fr] items-center gap-2"
						>
							<label className="text-sm font-medium text-gray-800">
								{field.name}
							</label>

							<input
								type={field.type}
								value={field.value}
								onChange={(e) => handleAccountChange(index, e.target.value)}
								className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
								required
							/>
						</div>
					))}

					{/* Submit */}
					<button
						type="submit"
						className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 mt-2 rounded-lg font-medium transition-colors"
					>
						Apply for Withdrawal
					</button>
				</form>
			</div>
		</div>
	);
};

export default WithdrawalModal;
