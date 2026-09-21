import { X, Wallet, Clock, CheckCircle, XCircle, History } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import api from "../configs/axios";
import { getAllUserListing } from "../app/features/listingSlice";

const WithdrawalModal = ({ onClose, available = 0, currency = "$" }) => {
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
	const [loading, setLoading] = useState(false);
	const [history, setHistory] = useState([]);
	const [historyLoading, setHistoryLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("withdraw"); // "withdraw" | "history"

	// Fetch withdrawal history on mount
	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const { data } = await api.get("/api/listing/my-withdrawals");
				setHistory(data.withdrawals || []);
			} catch {
				// silently fail – history is non-critical
			} finally {
				setHistoryLoading(false);
			}
		};
		fetchHistory();
	}, []);

	const handleAccountChange = (index, value) => {
		setAccount((prev) =>
			prev.map((field, i) => (i === index ? { ...field, value } : field)),
		);
	};

	const getStatusInfo = (w) => {
		if (w.isWithdrawn)
			return { label: "Paid", color: "text-green-600 bg-green-50", icon: <CheckCircle className="w-3.5 h-3.5" /> };
		if (w.isRejected)
			return { label: "Rejected", color: "text-red-600 bg-red-50", icon: <XCircle className="w-3.5 h-3.5" /> };
		return { label: "Pending", color: "text-yellow-600 bg-yellow-50", icon: <Clock className="w-3.5 h-3.5" /> };
	};

	const handleSubmission = async (e) => {
		e.preventDefault();
		const parsedAmount = parseFloat(amount);

		if (!parsedAmount || parsedAmount <= 0) {
			return toast.error("Please enter a valid amount");
		}
		if (parsedAmount > available) {
			return toast.error(`Amount cannot exceed your available balance of ${currency}${available.toFixed(2)}`);
		}
		for (const field of account) {
			if (!field.value) {
				return toast.error(`Please fill in the ${field.name} field`);
			}
		}

		const confirm = window.confirm(
			`Confirm withdrawal of ${currency}${parsedAmount.toFixed(2)}?`,
		);
		if (!confirm) return;

		try {
			setLoading(true);
			const { data } = await api.post("/api/listing/withdraw", {
				account,
				amount: parsedAmount,
			});
			toast.success(data.message);
			dispatch(getAllUserListing());
			onClose();
		} catch (error) {
			toast.error(error?.response?.data?.message || error?.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="z-[100] fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
				{/* Header */}
				<div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 rounded-t-xl flex items-center justify-between shrink-0">
					<div>
						<h3 className="font-semibold text-lg">Withdrawal Request</h3>
						<p className="text-sm text-indigo-100">
							Submit your bank details to withdraw balance
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-1 hover:bg-white/20 rounded-full transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Available Balance Banner */}
				<div className="bg-indigo-50 border-b border-indigo-100 px-5 py-3 flex items-center justify-between shrink-0">
					<div className="flex items-center gap-2 text-indigo-700">
						<Wallet className="w-4 h-4" />
						<span className="text-sm font-medium">Available Balance</span>
					</div>
					<span className="text-xl font-bold text-indigo-700">
						{currency}{available.toFixed(2)}
					</span>
				</div>

				{/* Tabs */}
				<div className="flex border-b border-gray-200 shrink-0">
					<button
						onClick={() => setActiveTab("withdraw")}
						className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
							activeTab === "withdraw"
								? "text-indigo-600 border-b-2 border-indigo-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Withdraw
					</button>
					<button
						onClick={() => setActiveTab("history")}
						className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
							activeTab === "history"
								? "text-indigo-600 border-b-2 border-indigo-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						<History className="w-3.5 h-3.5" />
						History
					</button>
				</div>

				{/* Body */}
				<div className="overflow-y-auto flex-1">
					{activeTab === "withdraw" ? (
						<form onSubmit={handleSubmission} className="flex flex-col gap-4 p-5">
							{/* Amount */}
							<div className="grid grid-cols-[2fr_3fr] items-center gap-2">
								<label className="text-sm font-medium text-gray-800">
									Amount
								</label>
								<div className="flex flex-col gap-1">
									<input
										type="number"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										max={available}
										min={1}
										step="0.01"
										placeholder={`Max: ${currency}${available.toFixed(2)}`}
										className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
										required
									/>
									{amount && parseFloat(amount) > available && (
										<p className="text-xs text-red-500">
											Exceeds available balance ({currency}{available.toFixed(2)})
										</p>
									)}
									{amount && parseFloat(amount) > 0 && parseFloat(amount) <= available && (
										<p className="text-xs text-green-600">
											✓ Valid amount
										</p>
									)}
								</div>
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
								disabled={loading || available <= 0}
								className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white py-2.5 mt-2 rounded-lg font-medium transition-colors"
							>
								{loading ? "Submitting..." : "Apply for Withdrawal"}
							</button>

							{available <= 0 && (
								<p className="text-center text-sm text-gray-500">
									You have no available balance to withdraw.
								</p>
							)}
						</form>
					) : (
						<div className="p-5">
							{historyLoading ? (
								<div className="text-center py-8 text-gray-400 text-sm">
									Loading history...
								</div>
							) : history.length === 0 ? (
								<div className="text-center py-8 text-gray-400 text-sm">
									No withdrawal requests yet.
								</div>
							) : (
								<div className="flex flex-col gap-3">
									{history.map((w) => {
										const status = getStatusInfo(w);
										return (
											<div
												key={w.id}
												className="border border-gray-100 rounded-lg p-3 flex items-center justify-between"
											>
												<div>
													<p className="font-semibold text-gray-800">
														{currency}{w.amount.toFixed(2)}
													</p>
													<p className="text-xs text-gray-400 mt-0.5">
														{new Date(w.createdAt).toLocaleDateString("en-US", {
															day: "numeric",
															month: "short",
															year: "numeric",
														})}
													</p>
												</div>
												<span
													className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${status.color}`}
												>
													{status.icon}
													{status.label}
												</span>
											</div>
										);
									})}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default WithdrawalModal;
