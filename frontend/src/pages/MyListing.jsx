import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	Plus,
	Eye,
	CheckCircle,
	TrendingUp,
	DollarSign,
	Wallet,
	ArrowDownCircle,
	Coins,
	Star,
	Users,
	Instagram,
	Facebook,
	Twitter,
	Music2,
	Youtube,
	Lock,
	Ban,
	XCircle,
	Clock,
	Trash2,
	Edit,
	EyeOff,
	EyeIcon,
} from "lucide-react";
import StatCard from "../components/StatCard";
import CredentialSubmission from "../components/CredentialSubmission";
import WithdrawalModal from "../components/WithdrawModel";

import toast from "react-hot-toast";
import api from "../configs/axios";
import {
	getAllPublicListing,
	getAllUserListing,
} from "../app/features/listingSlice";

const MyListings = () => {
	const {
		userListings = [],
		balance = { earned: 0, withdrawn: 0, available: 0 },
	} = useSelector((state) => state.listing);

	const [showCredentialSubmission, setShowCredentialSubmission] =
		useState(null);

	const [showWithdrawal, setShowWithdrawal] = useState(null);

	const currency = import.meta.env.VITE_CURRENCY || "$";
	const navigate = useNavigate();

	const dispatch = useDispatch();

	// Platform icons mapping
	const platformIcons = {
		instagram: <Instagram className="w-6 h-6 text-pink-600" />,
		facebook: <Facebook className="w-6 h-6 text-blue-600" />,
		twitter: <Twitter className="w-6 h-6 text-sky-500" />,
		tiktok: <Music2 className="w-6 h-6 text-black" />,
		youtube: <Youtube className="w-6 h-6 text-red-600" />,
	};

	// Total value of all listings
	const totalValue = userListings.reduce(
		(sum, listing) => sum + (listing.price || 0),
		0,
	);

	const activeListings = userListings.filter(
		(listing) => listing.status === "active",
	).length;

	const soldListings = userListings.filter(
		(listing) => listing.status === "sold",
	).length;

	const formatNumber = (num) => {
		if (!num && num !== 0) return "0";
		if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
		if (num >= 1000) return (num / 1000).toFixed(1) + "K";
		return num?.toString() || "0";
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "active":
				return <CheckCircle className="w-3.5 h-3.5 text-green-600" />;
			case "ban":
				return <Ban className="w-3.5 h-3.5 text-red-600" />;
			case "sold":
				return <DollarSign className="w-3.5 h-3.5 text-indigo-600" />;
			case "inactive":
				return <XCircle className="w-3.5 h-3.5 text-gray-400" />;
			default:
				return <Clock className="w-3.5 h-3.5 text-yellow-600" />;
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "active":
				return "text-green-600";
			case "ban":
				return "text-red-600";
			case "sold":
				return "text-indigo-600";
			case "inactive":
				return "text-gray-600";
			default:
				return "text-yellow-600";
		}
	};

	const toggleStatus = async (listingId) => {
		try {
			toast.loading("updating listing status....");
			const { data } = await api.put(`/api/listing/${listingId}/status`);
			dispatch(getAllUserListing());
			dispatch(getAllPublicListing());
			toast.dismiss();
			toast.success(data.message);
		} catch (error) {
			toast.dismiss();
			toast.error(error?.response?.data?.message || error.message);
		}
	};

	const deleteListing = async (listingId) => {
		try {
			const confirm = window.confirm(
				"Are you sure you want to delete this listing? if credentials are changed, new credentials will be sent to your email",
			);
			if (!confirm) return;
			toast.loading("deleting listing ....");
			const { data } = await api.delete(`/api/listing/${listingId}`);
			dispatch(getAllUserListing());
			dispatch(getAllPublicListing());
			toast.dismiss();
			toast.success(data.message);
		} catch (error) {
			toast.dismiss();
			toast.error(error?.response?.data?.message || error.message);
		}
	};

	const markAsFeatured = async (listingId) => {
		try {
			toast.loading("featuring listing...");
			const { data } = await api.put(`/api/listing/featured/${listingId}`);
			dispatch(getAllUserListing());
			dispatch(getAllPublicListing());
			toast.dismiss();
			toast.success(data.message);
		} catch (error) {
			toast.dismiss();
			toast.error(error?.response?.data?.message || error.message);
		}
	};

	const handleEdit = (listingId) => {
		navigate(`/edit-listing/${listingId}`);
	};

	const handleAddCredentials = (listingId) => {
		navigate(`/add-credentials/${listingId}`);
	};

	return (
		<div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
					<p className="text-gray-600 mt-1">
						Manage your social media account listings
					</p>
				</div>
				<button
					onClick={() => navigate("/create-listing")}
					className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 mt-4 md:mt-0"
				>
					<Plus className="w-4 h-4" />
					<span>New Listing</span>
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<StatCard
					title="Total Listings"
					value={userListings.length}
					icon={<Eye className="w-6 h-6 text-indigo-600" />}
					color="indigo"
				/>
				<StatCard
					title="Active Listings"
					value={activeListings}
					icon={<CheckCircle className="w-6 h-6 text-green-600" />}
					color="green"
				/>
				<StatCard
					title="Sold"
					value={soldListings}
					icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
					color="indigo"
				/>
				<StatCard
					title="Total Value"
					value={`${currency} ${totalValue.toLocaleString()}`}
					icon={<DollarSign className="w-6 h-6 text-indigo-600" />}
					color="indigo"
				/>
			</div>

			{/* Balance Section */}
			<div className="flex flex-col sm:flex-row justify-between gap-4 xl:gap-20 p-6 mb-10 bg-white rounded-xl border border-gray-200">
				{[
					{ label: "Earned", value: balance.earned, icon: Wallet },
					{
						label: "Withdrawn",
						value: balance.withdrawn,
						icon: ArrowDownCircle,
					},
					{ label: "Available", value: balance.available, icon: Coins },
				].map((item, index) => (
					<div
						onClick={() =>
							item.label === "Available" && setShowWithdrawal(true)
						}
						key={index}
						className="flex flex-1 items-center justify-between p-4 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
					>
						<div className="flex items-center gap-3">
							<item.icon className="text-gray-500 w-6 h-6" />
							<span className="font-medium text-gray-600">{item.label}</span>
						</div>
						<span className="text-xl font-medium text-gray-700">
							{currency} {item.value?.toFixed(2)}
						</span>
					</div>
				))}
			</div>

			{/* Listings */}
			{userListings.length === 0 ? (
				<div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Plus className="w-8 h-8 text-gray-400" />
					</div>
					<h3 className="text-xl font-medium text-gray-800 mb-2">
						No listings yet
					</h3>
					<p className="text-gray-600 mb-6">
						Start by creating your first listing
					</p>
					<button
						onClick={() => navigate("/create-listing")}
						className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
					>
						Create First Listing
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{userListings.map((listing) => (
						<div
							key={listing.id}
							className="bg-white rounded-lg border border-gray-200 hover:shadow-lg shadow-gray-200/70 transition-shadow"
						>
							<div className="p-6">
								<div className="flex items-start gap-4 justify-between mb-4">
									{platformIcons[listing.platform] || (
										<Users className="w-6 h-6 text-gray-400" />
									)}

									<div className="flex-1">
										<div className="flex justify-between items-start">
											<h3 className="text-lg font-semibold text-gray-800">
												{listing.title}
											</h3>

											<div className="flex items-center gap-2">
												<div className="relative group">
													<Lock className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
													<div className="invisible group-hover:visible absolute right-0 top-0 pt-5 z-10">
														<div className="bg-white text-gray-600 text-xs rounded-lg border border-gray-200 p-2 min-w-[140px] shadow-lg">
															{!listing.isCredentialSubmitted && (
																<>
																	<button
																		onClick={() =>
																			setShowCredentialSubmission(listing)
																		}
																		className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
																	>
																		Add Credentials
																	</button>
																	<hr className="border-gray-200 my-1" />
																</>
															)}
															<div className="px-3 py-2">
																<span className="font-medium">Status: </span>
																<span
																	className={
																		listing.isCredentialSubmitted
																			? listing.isCredentialVerified
																				? listing.isCredentialChanged
																					? "text-green-600 font-medium"
																					: "text-indigo-600 font-medium"
																				: "text-slate-600 font-medium"
																			: "text-red-600 font-medium"
																	}
																>
																	{listing.isCredentialSubmitted
																		? listing.isCredentialVerified
																			? listing.isCredentialChanged
																				? "Changed"
																				: "Verified"
																			: "Submitted"
																		: "Not Submitted"}
																</span>
															</div>
														</div>
													</div>
												</div>

												{listing.status === "active" && (
													<Star
														onClick={() => markAsFeatured(listing.id)}
														className={`w-5 h-5 text-yellow-500 cursor-pointer ${
															listing.featured ? "fill-yellow-500" : "fill-none"
														}`}
													/>
												)}
											</div>
										</div>

										<p className="text-sm text-gray-600 mt-1">
											@{listing.username}
										</p>
									</div>
								</div>

								<div className="space-y-4 mt-4">
									<div className="grid grid-cols-2 gap-2 text-sm">
										{/* Followers count */}
										<div className="flex items-center space-x-2">
											<Users className="w-4 h-4 text-gray-400" />
											<span>
												{formatNumber(listing.followers_count)} followers
											</span>
										</div>

										{/* Status */}
										<div
											className={`flex items-center justify-end gap-1 ${getStatusColor(listing.status)}`}
										>
											{getStatusIcon(listing.status)}
											<span className="capitalize">{listing.status}</span>
										</div>
									</div>

									{/* Engagement rate - separate row under followers */}
									<div className="flex items-center space-x-2 text-sm text-gray-600">
										<TrendingUp className="w-4 h-4 text-gray-400" />
										<span>{listing.engagement_rate}% engagement rate</span>
									</div>
								</div>

								{/* Price and Actions */}
								<div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
									<span className="text-2xl font-bold text-gray-800">
										{currency}
										{listing.price?.toLocaleString()}
									</span>
									<div className="flex items-center space-x-2">
										{listing.status !== "sold" && (
											<button
												onClick={() => deleteListing(listing.id)}
												className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-500 transition-colors"
												title="Delete listing"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										)}

										<button
											onClick={() => handleEdit(listing.id)}
											className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors"
											title="Edit listing"
										>
											<Edit className="w-4 h-4" />
										</button>

										{listing.status === "active" ? (
											<button
												onClick={() => toggleStatus(listing.id)}
												className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-purple-600 transition-colors"
												title="Deactivate listing"
											>
												<EyeOff className="w-4 h-4" />
											</button>
										) : (
											<button
												onClick={() => toggleStatus(listing.id)}
												className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-purple-600 transition-colors"
												title="Activate listing"
											>
												<EyeIcon className="w-4 h-4" />
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
			{showCredentialSubmission && (
				<CredentialSubmission
					listing={showCredentialSubmission}
					onClose={() => setShowCredentialSubmission(null)}
				></CredentialSubmission>
			)}
			{showWithdrawal && (
				<WithdrawalModal
					onClose={() => setShowWithdrawal(null)}
				></WithdrawalModal>
			)}
			<div className="bg-white border-t border-gray-200 p-4 text-center mt-28">
				<p className="text-sm text-gray-500">
					© 2026 <span className="text-indigo-600">Flipearn</span>. All rights
					reserved.
				</p>
			</div>
		</div>
	);
};

export default MyListings;
