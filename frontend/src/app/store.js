import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./features/listingSlice";
import chatReducer from "./features/chatSlice";
import planReducer from "./features/planSlice";

export const store = configureStore({
	reducer: {
		listing: listingReducer,
		chat: chatReducer,
		plan: planReducer,
	},
});
