import { ArrowLeftIcon, FilterIcon, SearchX } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import FilterSidebar from "../components/FilterSidebar";

const MarketPlace = () => {
	const [searchParams] = useSearchParams();
	const search = searchParams.get("search") || "";

	const navigate = useNavigate();
	const [showFilterPhone, setShowFilterPhone] = useState(false);

	const { listings = [] } = useSelector((state) => state.listing || {});

	const [filters, setFilters] = useState({
		platform: null,
		maxPrice: 100000,
		minFollowers: 0,
		niche: null,
		verified: false,
		monetized: false,
	});

	const filteredListings = listings.filter((listing) => {
		// Platform
		if (filters.platform && filters.platform.length > 0) {
			if (!filters.platform.includes(listing.platform)) return false;
		}

		// Max Price
		if (filters.maxPrice && listing.price > filters.maxPrice) return false;

		// Min Followers
		if (filters.minFollowers && listing.followers_count < filters.minFollowers)
			return false;

		// Niche
		if (filters.niche && filters.niche.length > 0) {
			if (!filters.niche.includes(listing.niche)) return false;
		}

		// Verified
		if (filters.verified && !listing.verified) return false;

		// Monetized
		if (filters.monetized && !listing.monetized) return false;

		// ✅ Search FIXED
		if (search) {
			const trimmed = search.trim().toLowerCase();

			const matches =
				listing.title?.toLowerCase().includes(trimmed) ||
				listing.username?.toLowerCase().includes(trimmed) ||
				listing.description?.toLowerCase().includes(trimmed) ||
				listing.niche?.toLowerCase().includes(trimmed) ||
				listing.platform?.toLowerCase().includes(trimmed);

			if (!matches) return false;
		}

		return true;
	});

	return (
		<div className="px-6 md:px-16 lg:px-24 xl:px-32">
			<div className="flex items-center justify-between text-slate-500">
				<button
					onClick={() => {
						navigate("/");
						window.scrollTo(0, 0);
					}}
					className="flex items-center gap-2"
				>
					<ArrowLeftIcon className="size-4" />
					Back to Home
				</button>

				<button
					onClick={() => setShowFilterPhone(!showFilterPhone)}
					className="flex sm:hidden items-center gap-2 py-5"
				>
					<FilterIcon className="size-4" />
					Filters
				</button>
			</div>

			<div className="relative flex items-start justify-between gap-8 pb-8">
				<FilterSidebar
					setShowFilterPhone={setShowFilterPhone}
					showFilterPhone={showFilterPhone}
					setFilters={setFilters}
					filters={filters}
				/>

				<div className="flex-1">
					{filteredListings.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-24 text-center text-gray-400 gap-4">
							<SearchX className="size-12 text-gray-300" />
							<h3 className="text-lg font-semibold text-gray-500">
								No listings found
							</h3>
							<p className="text-sm text-gray-400 max-w-xs">
								We couldn't find any listings matching your current filters. Try
								adjusting or clearing your filters.
							</p>
							<button
								onClick={() =>
									setFilters({
										platform: null,
										maxPrice: 100000,
										minFollowers: 0,
										niche: null,
										verified: false,
										monetized: false,
									})
								}
								className="mt-2 px-4 py-2 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
							>
								Clear all filters
							</button>
						</div>
					) : (
						<div className="grid xl:grid-cols-2 gap-4">
							{filteredListings
								.sort((a, b) => (a.featured ? -1 : b.featured ? 1 : 0))
								.map((listing) => (
									<div
										key={listing.id}
										className="bg-white p-4 rounded-lg shadow"
									>
										<ListingCard listing={listing} />
									</div>
								))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MarketPlace;
