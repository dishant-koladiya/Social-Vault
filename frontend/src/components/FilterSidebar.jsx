import React from "react";
import { ChevronDown, FilterIcon, X } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const FilterSidebar = ({
	showFilterPhone,
	setShowFilterPhone,
	filters,
	setFilters,
}) => {
	const currency = import.meta.env.VITE_CURRENCY;
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [search, setSearch] = React.useState("");
	const [expandedSections, setExpandedSections] = React.useState({
		platform: true,
		price: true,
		followers: true,
		niche: true,
		status: true,
	});

	const toggleSection = (section) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const onChangeSearch = (e) => {
		const value = e.target.value;
		setSearch(value);

		if (value.trim()) {
			setSearchParams({ search: value.trim() });
		} else {
			setSearchParams({});
			navigate("/marketplace");
		}
	};

	const onFilterChange = (newFilters) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	};

	const onClearFilters = () => {
		if (search) {
			setSearch("");
			setSearchParams({});
			navigate("/marketplace");
		}

		setFilters({
			platform: null,
			maxPrice: null,
			minFollowers: 0,
			niche: null,
			verified: false,
			monetized: false,
		});
	};

	const platforms = [
		{ value: "youtube", label: "YouTube" },
		{ value: "instagram", label: "Instagram" },
		{ value: "tiktok", label: "TikTok" },
		{ value: "twitter", label: "Twitter" },
		{ value: "twitch", label: "Twitch" },
		{ value: "facebook", label: "Facebook" },
		{ value: "linkedin", label: "LinkedIn" },
		{ value: "discord", label: "Discord" },
	];

	const niches = [
		{ value: "lifestyle", label: "Lifestyle" },
		{ value: "fitness", label: "Fitness" },
		{ value: "food", label: "Food" },
		{ value: "travel", label: "Travel" },
		{ value: "tech", label: "Technology" },
		{ value: "gaming", label: "Gaming" },
		{ value: "fashion", label: "Fashion" },
		{ value: "beauty", label: "Beauty" },
		{ value: "business", label: "Business" },
		{ value: "education", label: "Education" },
		{ value: "entertainment", label: "Entertainment" },
		{ value: "music", label: "Music" },
		{ value: "art", label: "Art" },
		{ value: "sports", label: "Sports" },
		{ value: "health", label: "Health" },
		{ value: "finance", label: "Finance" },
	];

	return (
		<div
			className={`${
				showFilterPhone ? "max-sm:fixed" : "max-sm:hidden"
			} max-sm:inset-0 z-50 max-sm:h-screen max-sm:overflow-scroll 
      bg-white rounded-lg shadow-sm border border-gray-200 
      h-fit sticky top-24 md:min-w-300px`}
		>
			<div className="p-4 border-b border-gray-200">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2 text-gray-700">
						<FilterIcon className="size-4" />
						<h3 className="font-semibold">Filters</h3>
					</div>

					<div className="flex items-center gap-2">
						<X
							onClick={onClearFilters}
							className="size-6 text-gray-500 hover:text-gray-700 p-1 
              hover:bg-gray-100 rounded transition-colors cursor-pointer"
						/>

						<button
							onClick={() => setShowFilterPhone(false)}
							className="sm:hidden text-sm border text-gray-700 px-3 py-1 rounded"
						>
							Apply
						</button>
					</div>
				</div>
			</div>

			<div className="p-4 space-y-6 sm:max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
				{/* Search bar */}
				<div className="flex items-center justify-between">
					<input
						type="text"
						onChange={onChangeSearch}
						value={search}
						placeholder="Search by username, platform or niche etc."
						className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-indigo-500"
					/>
				</div>

				{/* Platform */}
				<div>
					<button
						onClick={() => toggleSection("platform")}
						className="flex items-center justify-between w-full mb-3"
					>
						<label className="text-sm font-medium text-gray-800">
							Platform
						</label>
						<ChevronDown
							className={`size-4 transition-transform ${
								expandedSections.platform ? "rotate-180" : ""
							}`}
						/>
					</button>
					{expandedSections.platform && (
						<div className="ml-4 mt-2 space-y-2">
							{platforms.map((plat) => (
								<div key={plat.value} className="flex items-center">
									<label className="flex items-center gap-2 text-gray-700 text-sm">
										<input
											type="checkbox"
											id={plat.value}
											checked={filters.platform?.includes(plat.value) ?? false}
											onChange={(e) => {
												const checked = e.target.checked;
												const current = filters.platform || [];
												const updated = checked
													? [...current, plat.value]
													: current.filter((p) => p !== plat.value);

												onFilterChange({
													platform: updated.length > 0 ? updated : null,
												});
											}}
										/>
										<span>{plat.label}</span>
									</label>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Price Range */}
				<div>
					<button
						onClick={() => toggleSection("price")}
						className="flex items-center justify-between w-full mb-3"
					>
						<label className="text-sm font-medium text-gray-800">
							Price Range
						</label>
						<ChevronDown
							className={`size-4 transition-transform ${
								expandedSections.price ? "rotate-180" : ""
							}`}
						/>
					</button>
					{expandedSections.price && (
						<div className="space-y-3">
							<input
								type="range"
								min={0}
								max={100000}
								step={100}
								value={filters.maxPrice}
								onChange={(e) =>
									onFilterChange({
										maxPrice: parseInt(e.target.value, 10),
									})
								}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
							/>
							<div className="flex items-center justify-between text-sm text-gray-600">
								<span>{currency}0</span>
								<span>
									{currency}
									{(filters.maxPrice ?? 100000).toLocaleString()}
								</span>
							</div>
						</div>
					)}
				</div>

				{/* Minimum Followers */}
				<div>
					<button
						onClick={() => toggleSection("followers")}
						className="flex items-center justify-between w-full mb-3"
					>
						<label className="text-sm font-medium text-gray-800">
							Minimum Followers
						</label>
						<ChevronDown
							className={`size-4 transition-transform ${
								expandedSections.followers ? "rotate-180" : ""
							}`}
						/>
					</button>
					{expandedSections.followers && (
						<select
							value={filters.minFollowers.toString()}
							onChange={(e) =>
								onFilterChange({
									minFollowers: parseInt(e.target.value, 10) || 0,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500"
						>
							<option value="0">Any amount</option>
							<option value="1000">1K+</option>
							<option value="10000">10K+</option>
							<option value="50000">50K+</option>
							<option value="100000">100K+</option>
							<option value="500000">500K+</option>
							<option value="1000000">1M+</option>
						</select>
					)}
				</div>

				{/* Niche */}
				<div>
					<button
						onClick={() => toggleSection("niche")}
						className="flex items-center justify-between w-full mb-3"
					>
						<label className="text-sm font-medium text-gray-800">Niche</label>
						<ChevronDown
							className={`size-4 transition-transform ${
								expandedSections.niche ? "rotate-180" : ""
							}`}
						/>
					</button>
					{expandedSections.niche && (
						<select
							value={filters.niche ?? ""}
							onChange={(e) =>
								onFilterChange({
									niche: e.target.value || null,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500"
						>
							<option value="">All niches</option>
							{niches.map((niche) => (
								<option key={niche.value} value={niche.value}>
									{niche.label}
								</option>
							))}
						</select>
					)}
				</div>

				{/* Account Status */}
				<div>
					<button
						onClick={() => toggleSection("status")}
						className="flex items-center justify-between w-full mb-3"
					>
						<label className="text-sm font-medium text-gray-800">
							Account Status
						</label>
						<ChevronDown
							className={`size-4 transition-transform ${
								expandedSections.status ? "rotate-180" : ""
							}`}
						/>
					</button>
					{expandedSections.status && (
						<div className="space-y-3">
							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									checked={filters.verified}
									onChange={(e) =>
										onFilterChange({ verified: e.target.checked })
									}
								/>
								<span className="text-sm text-gray-700">
									Verified accounts only
								</span>
							</label>

							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									checked={filters.monetized}
									onChange={(e) =>
										onFilterChange({ monetized: e.target.checked })
									}
								/>
								<span className="text-sm text-gray-700">
									Monetized accounts only
								</span>
							</label>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default FilterSidebar;
