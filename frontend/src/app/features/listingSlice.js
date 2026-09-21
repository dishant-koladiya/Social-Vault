import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../configs/axios";

// ✅ Get all public listings (no auth needed)
export const getAllPublicListing = createAsyncThunk(
	"listing/getAllPublicListing",
	async () => {
		try {
			const { data } = await api.get("/api/listing/public");
			return data;
		} catch (error) {
			console.error("Failed to fetch public listings:", error);
			return { listings: [] };
		}
	},
);

// ✅ Get all user listings + balance
export const getAllUserListing = createAsyncThunk(
	"listing/getAllUserListing",
	async () => {
		try {
			const { data } = await api.get("/api/listing/user");
			return data;
		} catch (error) {
			console.error("Failed to fetch user listings:", error);
			return {
				listings: [],
				balance: { earned: 0, withdrawn: 0, available: 0 },
			};
		}
	},
);

// ✅ Get user's own withdrawal history
export const getUserWithdrawals = createAsyncThunk(
	"listing/getUserWithdrawals",
	async () => {
		try {
			const { data } = await api.get("/api/listing/my-withdrawals");
			return data;
		} catch (error) {
			console.error("Failed to fetch withdrawal history:", error);
			return { withdrawals: [] };
		}
	},
);

// ✅ Slice
const listingSlice = createSlice({
	name: "listing",
	initialState: {
		listings: [],
		userListings: [],
		balance: { earned: 0, withdrawn: 0, available: 0 },
		withdrawals: [],
	},
	reducers: {
		setListings: (state, action) => {
			state.listings = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getAllPublicListing.fulfilled, (state, action) => {
			state.listings = action.payload.listings || [];
		});
		builder.addCase(getAllUserListing.fulfilled, (state, action) => {
			state.userListings = action.payload.listings || [];
			state.balance = action.payload.balance || {
				earned: 0,
				withdrawn: 0,
				available: 0,
			};
		});
		builder.addCase(getUserWithdrawals.fulfilled, (state, action) => {
			state.withdrawals = action.payload.withdrawals || [];
		});
	},
});

export const { setListings } = listingSlice.actions;
export default listingSlice.reducer;
