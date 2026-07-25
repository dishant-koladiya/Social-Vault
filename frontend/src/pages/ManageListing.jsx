import {
	Loader2Icon,
	ChevronLeft,
	ChevronRight,
	CheckCircle2,
	UploadCloud,
	X,
	Sparkles,
	BarChart3,
	DollarSign,
	ImageIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../configs/axios";
import {
	getAllPublicListing,
	getAllUserListing,
} from "../app/features/listingSlice";

/* ─────────────────────────────────────────────
   Wizard configuration
───────────────────────────────────────────── */
const STEPS = [
	{ id: 1, label: "Basic Info", icon: Sparkles, short: "Basics" },
	{ id: 2, label: "Metrics", icon: BarChart3, short: "Metrics" },
	{ id: 3, label: "Pricing", icon: DollarSign, short: "Pricing" },
	{ id: 4, label: "Media", icon: ImageIcon, short: "Media" },
];

const platforms = [
	"youtube","instagram","tiktok","facebook","twitter",
	"linkedin","pinterest","snapchat","twitch","discord",
];
const niches = [
	"lifestyle","fitness","food","travel","tech","gaming",
	"fashion","beauty","business","education","entertainment",
	"music","art","sports","health","finance","other",
];
const ageRanges = [
	"13-17 years","18-24 years","25-34 years","35-44 years",
	"45-54 years","55+ years","Mixed ages",
];

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const ManageListing = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { userListings = [] } = useSelector((state) => state.listing);

	const [step, setStep] = useState(1);
	const [direction, setDirection] = useState("forward");
	const [animating, setAnimating] = useState(false);
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

	const handleInputChange = (field, value) =>
		setFormData((prev) => ({ ...prev, [field]: value }));

	const handleImageUpload = (event) => {
		const files = Array.from(event.target.files);
		if (!files.length) return;
		if (files.length + formData.images.length > 5) {
			toast.error("You can add up to 5 images");
			return;
		}
		setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
	};

	const removeImage = (indexToRemove) =>
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== indexToRemove),
		}));

	useEffect(() => {
		if (!id) return;
		setIsEditing(true);
		setLoadingListing(true);
		const listing = userListings.find(
			(l) => l._id === id || l.id === id,
		);
		if (listing) {
			setFormData(listing);
			setLoadingListing(false);
		} else {
			toast.error("Listing not found");
			navigate("/my-listings");
		}
	}, [id, navigate, userListings]);

	/* Step validation */
	const isStepValid = (s) => {
		if (s === 1) return formData.title && formData.platform && formData.username && formData.niche;
		if (s === 2) return !!formData.followers_count;
		if (s === 3) return formData.price && formData.description;
		return true;
	};

	const goTo = (target) => {
		if (animating) return;
		setDirection(target > step ? "forward" : "back");
		setAnimating(true);
		setTimeout(() => {
			setStep(target);
			setAnimating(false);
		}, 200);
	};

	const handleNext = () => { if (isStepValid(step) && step < 4) goTo(step + 1); };
	const handleBack = () => { if (step > 1) goTo(step - 1); };

	const handleSubmit = async () => {
		setIsSubmitting(true);
		const toastId = toast.loading(isEditing ? "Updating listing..." : "Creating listing...");

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

		if (isEditing) {
			dataCopy.images = formData.images.filter((img) => typeof img === "string");
		}

		try {
			const fd = new FormData();
			fd.append("accountDetails", JSON.stringify(dataCopy));
			const newImages = formData.images.filter((img) => img instanceof File);
			newImages.forEach((img) => fd.append("images", img));

			let response;
			if (isEditing) {
				response = await api.put(`/api/listing/${id}`, fd, {
					headers: { "Content-Type": "multipart/form-data" },
				});
			} else {
				response = await api.post("/api/listing", fd, {
					headers: { "Content-Type": "multipart/form-data" },
				});
			}

			toast.dismiss(toastId);
			toast.success(
				response.data.message ||
					(isEditing ? "Listing updated successfully!" : "Listing created successfully!"),
			);
			await dispatch(getAllUserListing());
			await dispatch(getAllPublicListing());
			navigate("/my-listings");
		} catch (error) {
			toast.dismiss(toastId);
			const msg =
				error.response?.data?.message ||
				error.response?.data?.error ||
				error.message ||
				(isEditing ? "Failed to update listing" : "Failed to create listing");
			toast.error(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loadingListing) {
		return (
			<div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
				<div className="flex flex-col items-center gap-3">
					<Loader2Icon className="size-9 animate-spin text-indigo-500" />
					<p className="text-sm text-slate-500 font-medium">Loading listing…</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
			{/* ── Header ── */}
			<header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
					<div>
						<h1 className="text-xl font-bold text-slate-800 leading-tight">
							{isEditing ? "Edit Listing" : "Create a Listing"}
						</h1>
						<p className="text-xs text-slate-400 mt-0.5">
							Step {step} of {STEPS.length} — {STEPS[step - 1].label}
						</p>
					</div>

					{/* Progress dots */}
					<div className="flex items-center gap-1.5">
						{STEPS.map((s) => (
							<button
								key={s.id}
								onClick={() => { if (s.id < step || isStepValid(step)) goTo(s.id); }}
								className={`transition-all duration-300 rounded-full ${
									s.id === step
										? "w-8 h-2.5 bg-indigo-600"
										: s.id < step
										? "w-2.5 h-2.5 bg-indigo-400"
										: "w-2.5 h-2.5 bg-slate-200"
								}`}
								title={s.label}
							/>
						))}
					</div>
				</div>

				{/* Step bar */}
				<div className="max-w-4xl mx-auto px-4 sm:px-6 pb-3">
					<div className="flex gap-1.5">
						{STEPS.map((s) => {
							const Icon = s.icon;
							const done = s.id < step;
							const active = s.id === step;
							return (
								<button
									key={s.id}
									onClick={() => { if (done || active) goTo(s.id); }}
									className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
										active
											? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
											: done
											? "bg-indigo-50 text-indigo-600 cursor-pointer hover:bg-indigo-100"
											: "bg-slate-100 text-slate-400 cursor-default"
									}`}
								>
									{done ? (
										<CheckCircle2 className="size-3.5" />
									) : (
										<Icon className="size-3.5" />
									)}
									<span className="hidden sm:inline">{s.short}</span>
								</button>
							);
						})}
					</div>
				</div>
			</header>

			{/* ── Main content ── */}
			<main className="flex-1 flex items-start justify-center py-8 px-4 sm:px-6">
				<div className="w-full max-w-4xl">
					<div
						className={`transition-all duration-200 ${
							animating
								? direction === "forward"
									? "opacity-0 translate-x-4"
									: "opacity-0 -translate-x-4"
								: "opacity-100 translate-x-0"
						}`}
					>
						{/* ── Step 1: Basic Info ── */}
						{step === 1 && (
							<StepCard title="Basic Information" subtitle="Tell us about the account you're listing">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
									<div className="sm:col-span-2">
										<WField label="Listing Title *">
											<WInput
												placeholder="e.g., Premium Travel Instagram Account"
												value={formData.title}
												onChange={(v) => handleInputChange("title", v)}
												required
											/>
										</WField>
									</div>
									<WField label="Platform *">
										<WSelect
											options={platforms}
											value={formData.platform}
											onChange={(v) => handleInputChange("platform", v)}
											placeholder="Select platform"
											required
										/>
									</WField>
									<WField label="Username / Handle *">
										<WInput
											placeholder="@username"
											value={formData.username}
											onChange={(v) => handleInputChange("username", v)}
											required
										/>
									</WField>
									<WField label="Niche / Category *">
										<WSelect
											options={niches}
											value={formData.niche}
											onChange={(v) => handleInputChange("niche", v)}
											placeholder="Select niche"
											required
										/>
									</WField>
								</div>
							</StepCard>
						)}

						{/* ── Step 2: Metrics ── */}
						{step === 2 && (
							<StepCard title="Account Metrics" subtitle="Provide your account's performance stats">
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
									<WField label="Followers Count *">
										<WInput
											type="number"
											min={0}
											placeholder="10,000"
											value={formData.followers_count}
											onChange={(v) => handleInputChange("followers_count", v)}
											required
											prefix="👥"
										/>
									</WField>
									<WField label="Engagement Rate (%)">
										<WInput
											type="number"
											min={0}
											max={100}
											step="0.1"
											placeholder="4.5"
											value={formData.engagement_rate}
											onChange={(v) => handleInputChange("engagement_rate", v)}
											prefix="📈"
										/>
									</WField>
									<WField label="Monthly Views">
										<WInput
											type="number"
											min={0}
											placeholder="100,000"
											value={formData.monthly_views}
											onChange={(v) => handleInputChange("monthly_views", v)}
											prefix="👁"
										/>
									</WField>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
									<WField label="Primary Audience Country">
										<WInput
											placeholder="e.g., United States"
											value={formData.country}
											onChange={(v) => handleInputChange("country", v)}
											prefix="🌍"
										/>
									</WField>
									<WField label="Primary Audience Age Range">
										<WSelect
											options={ageRanges}
											value={formData.age_range}
											onChange={(v) => handleInputChange("age_range", v)}
											placeholder="Select age range"
										/>
									</WField>
								</div>

								<div className="mt-6 flex flex-wrap gap-4">
									<ToggleCard
										label="Account Verified"
										desc="Blue / verified badge on platform"
										emoji="✅"
										checked={formData.verified}
										onChange={(v) => handleInputChange("verified", v)}
									/>
									<ToggleCard
										label="Account Monetized"
										desc="Earning revenue from this account"
										emoji="💰"
										checked={formData.monetized}
										onChange={(v) => handleInputChange("monetized", v)}
									/>
								</div>
							</StepCard>
						)}

						{/* ── Step 3: Pricing & Description ── */}
						{step === 3 && (
							<StepCard title="Pricing & Description" subtitle="Set your asking price and describe what makes this account valuable">
								<WField label="Asking Price (USD) *">
									<WInput
										type="number"
										min={0}
										step="0.01"
										placeholder="2,500.00"
										value={formData.price}
										onChange={(v) => handleInputChange("price", v)}
										required
										prefix="$"
									/>
								</WField>

								<div className="mt-5">
									<WField label="Description *">
										<textarea
											rows={7}
											placeholder="Describe your account's history, audience quality, content type, reason for selling, and any included assets..."
											value={formData.description || ""}
											onChange={(e) => handleInputChange("description", e.target.value)}
											required
											className="w-full px-4 py-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none placeholder-slate-400 transition-all"
										/>
									</WField>
								</div>

								<div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
									<p className="text-xs text-amber-700 font-medium">💡 Tip</p>
									<p className="text-xs text-amber-600 mt-1">
										Listings with detailed descriptions and transparent metrics sell{" "}
										<strong>3× faster</strong>. Be honest and thorough!
									</p>
								</div>
							</StepCard>
						)}

						{/* ── Step 4: Media ── */}
						{step === 4 && (
							<StepCard title="Screenshots & Proof" subtitle="Upload screenshots of your analytics to build buyer trust (max 5)">
								{/* Drop zone */}
								<label
									htmlFor="wizard-images"
									className="group flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 rounded-2xl py-10 cursor-pointer transition-all duration-200"
								>
									<UploadCloud className="size-10 text-slate-300 group-hover:text-indigo-400 transition-colors" />
									<div className="text-center">
										<p className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600">
											Click to upload images
										</p>
										<p className="text-xs text-slate-400 mt-0.5">
											PNG, JPG, WEBP — up to 5 files
										</p>
									</div>
									<input
										type="file"
										id="wizard-images"
										multiple
										accept="image/*"
										onChange={handleImageUpload}
										className="hidden"
									/>
								</label>

								{formData.images.length > 0 && (
									<div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
										{formData.images.map((img, index) => (
											<div
												key={index}
												className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm"
											>
												<img
													src={typeof img === "string" ? img : URL.createObjectURL(img)}
													alt={`Screenshot ${index + 1}`}
													className="w-full h-24 object-cover"
												/>
												<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
												<button
													type="button"
													onClick={() => removeImage(index)}
													className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
												>
													<X className="size-3" />
												</button>
												<div className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1 rounded">
													{index + 1}
												</div>
											</div>
										))}
										{formData.images.length < 5 && (
											<label
												htmlFor="wizard-images"
												className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 cursor-pointer text-slate-300 hover:text-indigo-400 transition-all"
											>
												<span className="text-2xl leading-none">+</span>
												<span className="text-[10px] mt-0.5">Add more</span>
											</label>
										)}
									</div>
								)}

								{formData.images.length === 0 && (
									<p className="text-center text-xs text-slate-400 mt-3">
										No images uploaded yet — screenshots greatly boost buyer confidence.
									</p>
								)}
							</StepCard>
						)}
					</div>

					{/* ── Navigation ── */}
					<div className="mt-6 flex items-center justify-between gap-3">
						<button
							type="button"
							onClick={step === 1 ? () => navigate(-1) : handleBack}
							className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
						>
							<ChevronLeft className="size-4" />
							{step === 1 ? "Cancel" : "Back"}
						</button>

						<div className="flex items-center gap-2 text-xs text-slate-400">
							{STEPS.map((s) => (
								<span
									key={s.id}
									className={`transition-all ${s.id === step ? "text-indigo-600 font-semibold" : ""}`}
								>
									{s.id < step ? "✓" : s.id === step ? s.label : "·"}
								</span>
							))}
						</div>

						{step < 4 ? (
							<button
								type="button"
								onClick={handleNext}
								disabled={!isStepValid(step)}
								className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
							>
								Next
								<ChevronRight className="size-4" />
							</button>
						) : (
							<button
								type="button"
								onClick={handleSubmit}
								disabled={isSubmitting || !isStepValid(3)}
								className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
							>
								{isSubmitting ? (
									<>
										<Loader2Icon className="size-4 animate-spin" />
										{isEditing ? "Updating…" : "Creating…"}
									</>
								) : (
									<>
										{isEditing ? "Update Listing" : "Publish Listing"}
										<CheckCircle2 className="size-4" />
									</>
								)}
							</button>
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const StepCard = ({ title, subtitle, children }) => (
	<div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100 p-6 sm:p-8">
		<div className="mb-6">
			<h2 className="text-lg font-bold text-slate-800">{title}</h2>
			{subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
		</div>
		{children}
	</div>
);

const WField = ({ label, children }) => (
	<div>
		<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
			{label}
		</label>
		{children}
	</div>
);

const WInput = ({ prefix, value, onChange, ...props }) => (
	<div className="relative flex items-center">
		{prefix && (
			<span className="absolute left-3 text-sm text-slate-400 select-none">{prefix}</span>
		)}
		<input
			value={value || ""}
			onChange={(e) => onChange(e.target.value)}
			{...props}
			className={`w-full ${prefix ? "pl-9" : "pl-4"} pr-4 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-slate-400 transition-all`}
		/>
	</div>
);

const WSelect = ({ options, value, onChange, placeholder, required }) => (
	<select
		value={value || ""}
		onChange={(e) => onChange(e.target.value)}
		required={required}
		className="w-full px-4 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all appearance-none cursor-pointer"
	>
		<option value="">{placeholder || "Select…"}</option>
		{options.map((opt) => (
			<option key={opt} value={opt}>
				{opt.charAt(0).toUpperCase() + opt.slice(1)}
			</option>
		))}
	</select>
);

const ToggleCard = ({ label, desc, emoji, checked, onChange }) => (
	<button
		type="button"
		onClick={() => onChange(!checked)}
		className={`flex-1 min-w-[180px] flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
			checked
				? "border-indigo-500 bg-indigo-50"
				: "border-slate-200 bg-white hover:border-slate-300"
		}`}
	>
		<span className="text-2xl">{emoji}</span>
		<div className="flex-1">
			<p className={`text-sm font-semibold ${checked ? "text-indigo-700" : "text-slate-700"}`}>
				{label}
			</p>
			<p className="text-xs text-slate-400 mt-0.5">{desc}</p>
		</div>
		<div
			className={`w-9 h-5 rounded-full flex-shrink-0 transition-colors duration-200 relative ${
				checked ? "bg-indigo-500" : "bg-slate-200"
			}`}
		>
			<div
				className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
					checked ? "left-4" : "left-0.5"
				}`}
			/>
		</div>
	</button>
);

export default ManageListing;
