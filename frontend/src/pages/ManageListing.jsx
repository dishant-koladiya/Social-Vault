import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../configs/axios";
import {
	getAllPublicListing,
	getAllUserListing,
} from "../app/features/listingSlice";

const ManageListing = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { userListings = [] } = useSelector((state) => state.listing);
	// const { getToken } = useAuth();

	const [loadingListing, setLoadingListing] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		platform: "",
		username: "",
		followers_count: "",
		engagement_rate: "",
		monthly_views: "",
		niche: "",
		price: "",
		description: "",
		verified: false,
		monetized: false,
		country: "",
		age_range: "",
		images: [],
	});

	const platforms = [
		"youtube",
		"instagram",
		"tiktok",
		"facebook",
		"twitter",
		"linkedin",
		"pinterest",
		"snapchat",
		"twitch",
		"discord",
	];

	const niches = [
		"lifestyle",
		"fitness",
		"food",
		"travel",
		"tech",
		"gaming",
		"fashion",
		"beauty",
		"business",
		"education",
		"entertainment",
		"music",
		"art",
		"sports",
		"health",
		"finance",
		"other",
	];

	const ageRanges = [
		"13-17 years",
		"18-24 years",
		"25-34 years",
		"35-44 years",
		"45-54 years",
		"55+ years",
		"Mixed ages",
	];

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleImageUpload = async (event) => {
		const files = Array.from(event.target.files);
		if (!files.length) return;

		if (files.length + formData.images.length > 5) {
			toast.error("You can add up to 5 images");
			return;
		}

		setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
	};

	const removeImage = (indexToRemove) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== indexToRemove),
		}));
	};

	// get listing data for edit if `id` is provided (edit mode)
	useEffect(() => {
		if (!id) return;

		setIsEditing(true);
		setLoadingListing(true);
		// Check both id and _id formats
		const listing = userListings.find(
			(listing) => listing._id === id || listing.id === id,
		);
		if (listing) {
			setFormData(listing);
			setLoadingListing(false);
		} else {
			toast.error("Listing not found");
			navigate("/my-listings");
		}
	}, [id, navigate, userListings]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		const toastId = toast.loading(
			isEditing ? "Updating listing..." : "Creating listing...",
		);

		// Create a copy of form data without images for JSON stringification
		const dataCopy = {
			title: formData.title,
			platform: formData.platform,
			username: formData.username,
			followers_count: formData.followers_count,
			engagement_rate: formData.engagement_rate,
			monthly_views: formData.monthly_views,
			niche: formData.niche,
			price: formData.price,
			description: formData.description,
			verified: formData.verified,
			monetized: formData.monetized,
			country: formData.country,
			age_range: formData.age_range,
		};

		// For editing, include existing image URLs
		if (isEditing) {
			dataCopy.images = formData.images.filter(
				(img) => typeof img === "string",
			);
		}

		try {
			const formDataInstance = new FormData();
			formDataInstance.append("accountDetails", JSON.stringify(dataCopy));

			// Append new images (File objects)
			const newImages = formData.images.filter((img) => img instanceof File);
			newImages.forEach((img) => {
				formDataInstance.append("images", img);
			});

			let response;
			if (isEditing) {
				response = await api.put(`/api/listing/${id}`, formDataInstance, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			} else {
				response = await api.post("/api/listing", formDataInstance, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			}

			toast.dismiss(toastId);
			toast.success(
				response.data.message ||
					(isEditing
						? "Listing updated successfully!"
						: "Listing created successfully!"),
			);

			// Refresh listings
			await dispatch(getAllUserListing());
			await dispatch(getAllPublicListing());

			navigate("/my-listings");
		} catch (error) {
			toast.dismiss(toastId);
			console.error("Submission error:", error);

			// Better error handling
			const errorMessage =
				error.response?.data?.message ||
				error.response?.data?.error ||
				error.message ||
				(isEditing ? "Failed to update listing" : "Failed to create listing");

			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loadingListing) {
		return (
			<div className="h-screen flex items-center justify-center">
				<Loader2Icon className="size-7 animate-spin text-indigo-600" />
			</div>
		);
	}

	return (
		<div className="min-h-screen py-8 bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800">
						{isEditing ? "Edit Listing" : "List Your Account"}
					</h1>
					<p className="text-gray-600 mt-2">
						{isEditing
							? "Update your existing account listing"
							: "Create a new listing to sell your social media account"}
					</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-8">
					<Section title="Basic Information">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<InputField
								label="Listing Title *"
								value={formData.title}
								placeholder="e.g., Premium Travel Instagram Account"
								onChange={(v) => handleInputChange("title", v)}
								required={true}
							/>
							<SelectField
								label="Platform *"
								options={platforms}
								value={formData.platform}
								onChange={(v) => handleInputChange("platform", v)}
								required={true}
							/>
							<InputField
								label="Username/Handle *"
								value={formData.username}
								placeholder="@username"
								onChange={(v) => handleInputChange("username", v)}
								required={true}
							/>
							<SelectField
								label="Niche/Category *"
								options={niches}
								value={formData.niche}
								onChange={(v) => handleInputChange("niche", v)}
								required={true}
							/>
						</div>
					</Section>

					{/* metrics */}
					<Section title="Account Metrics">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<InputField
								label="Followers Count *"
								type="number"
								min={0}
								value={formData.followers_count}
								placeholder="10000"
								onChange={(v) => handleInputChange("followers_count", v)}
								required={true}
							/>
							<InputField
								label="Engagement Rate (%)"
								type="number"
								min={0}
								max={100}
								step="0.1"
								value={formData.engagement_rate}
								placeholder="4.5"
								onChange={(v) => handleInputChange("engagement_rate", v)}
							/>
							<InputField
								label="Monthly Views/Impressions"
								type="number"
								min={0}
								value={formData.monthly_views}
								placeholder="100000"
								onChange={(v) => handleInputChange("monthly_views", v)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<InputField
								label="Primary Audience Country"
								value={formData.country}
								placeholder="United States"
								onChange={(v) => handleInputChange("country", v)}
							/>
							<SelectField
								label="Primary Audience Age Range"
								options={ageRanges}
								value={formData.age_range}
								onChange={(v) => handleInputChange("age_range", v)}
							/>
						</div>
						<div className="space-y-3">
							<CheckboxField
								label="Account is verified on the platform"
								checked={formData.verified}
								onChange={(v) => handleInputChange("verified", v)}
							/>
							<CheckboxField
								label="Account is monetized"
								checked={formData.monetized}
								onChange={(v) => handleInputChange("monetized", v)}
							/>
						</div>
					</Section>

					{/* pricing */}
					<Section title="Pricing & Description">
						<InputField
							label="Asking Price (USD) *"
							type="number"
							min={0}
							step="0.01"
							value={formData.price}
							placeholder="2500.00"
							onChange={(v) => handleInputChange("price", v)}
							required={true}
						/>
						<TextareaField
							label="Description *"
							value={formData.description}
							required={true}
							onChange={(v) => handleInputChange("description", v)}
						/>
					</Section>

					<Section title="Screenshots & Proof">
						<div className="border-2 border-dashed border-gray-300 text-center p-6 rounded-lg">
							<input
								type="file"
								id="images"
								multiple
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
							/>
							<label
								htmlFor="images"
								className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer inline-block"
							>
								Choose Files
							</label>
							<p className="text-sm text-gray-500 mt-2">
								Upload screenshots as proof of account analytics (max 5 images)
							</p>
						</div>

						{formData.images.length > 0 && (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
								{formData.images.map((img, index) => (
									<div key={index} className="relative">
										<img
											src={
												typeof img === "string" ? img : URL.createObjectURL(img)
											}
											alt={`Screenshot ${index + 1}`}
											className="w-full h-24 object-cover rounded-lg"
										/>
										<button
											type="button"
											onClick={() => removeImage(index)}
											className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
										>
											×
										</button>
									</div>
								))}
							</div>
						)}
					</Section>

					{/* Add submit button */}
					<div className="flex justify-end gap-3 text-sm">
						<button
							onClick={() => navigate(-1)}
							type="button"
							className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
							disabled={isSubmitting}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
							{isSubmitting
								? isEditing
									? "Updating..."
									: "Creating..."
								: isEditing
									? "Update Listing"
									: "Create Listing"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

// common elements (updated with better value handling)
const Section = ({ title, children }) => (
	<div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
		<h2 className="text-lg font-semibold text-gray-800">{title}</h2>
		{children}
	</div>
);

const InputField = ({
	label,
	value,
	onChange,
	placeholder,
	type = "text",
	required = false,
	min = null,
	max = null,
	step = null,
}) => {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				{label}
			</label>
			<input
				type={type}
				min={min}
				max={max}
				step={step}
				placeholder={placeholder}
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				className="w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
				required={required}
			/>
		</div>
	);
};

const SelectField = ({ label, options, value, onChange, required = false }) => {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				{label}
			</label>
			<select
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				className="w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
				required={required}
			>
				<option value="">Select {label}</option>
				{options.map((opt) => (
					<option key={opt} value={opt}>
						{opt.charAt(0).toUpperCase() + opt.slice(1)}
					</option>
				))}
			</select>
		</div>
	);
};

const CheckboxField = ({ label, checked, onChange, required = false }) => {
	return (
		<label className="flex items-center space-x-2 cursor-pointer">
			<input
				type="checkbox"
				checked={checked || false}
				onChange={(e) => onChange(e.target.checked)}
				className="size-4"
				required={required}
			/>
			<span className="text-sm text-gray-700">{label}</span>
		</label>
	);
};

const TextareaField = ({ label, value, onChange, required = false }) => {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				{label}
			</label>
			<textarea
				rows={5}
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				className="w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
				required={required}
			/>
		</div>
	);
};

export default ManageListing;
