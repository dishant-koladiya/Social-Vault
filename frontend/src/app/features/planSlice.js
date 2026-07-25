import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../configs/axios";

export const createOrder = createAsyncThunk(
	"plan/createOrder",
	async ({ plan }, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/api/plan/create-order", { plan });
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to create order",
			);
		}
	},
);

export const verifyPayment = createAsyncThunk(
	"plan/verifyPayment",
	async (paymentData, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/api/plan/verify-payment", paymentData);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Payment verification failed",
			);
		}
	},
);

export const fetchCurrentPlan = createAsyncThunk(
	"plan/fetchCurrentPlan",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await api.get("/api/plan/current");
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch plan",
			);
		}
	},
);

export const downgradePlan = createAsyncThunk(
	"plan/downgradePlan",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/api/plan/downgrade");
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to downgrade plan",
			);
		}
	},
);

const planSlice = createSlice({
	name: "plan",
	initialState: {
		plan: "FREE",
		planDetails: null,
		loading: false,
		error: null,
	},
	reducers: {
		clearPlanError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCurrentPlan.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCurrentPlan.fulfilled, (state, action) => {
				state.loading = false;
				state.plan = action.payload.plan;
				state.planDetails = action.payload.planDetails;
			})
			.addCase(fetchCurrentPlan.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(verifyPayment.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(downgradePlan.fulfilled, (state) => {
				state.plan = "FREE";
				state.planDetails = null;
			});
	},
});

export const { clearPlanError } = planSlice.actions;
export default planSlice.reducer;
