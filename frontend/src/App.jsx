// import React, { useEffect } from "react";
// import { Route, Routes, useLocation } from "react-router-dom";

// import Home from "./pages/Home";
// import MarketPlace from "./pages/MarketPlace";
// import MyListing from "./pages/MyListing";
// import ListingDetails from "./pages/ListingDetails";
// import ManageListing from "./pages/ManageListing";
// import Messages from "./pages/Messages";
// import MyOrders from "./pages/MyOrders";
// import Loading from "./pages/Loading";
// import Navbar from "./components/Navbar";
// import ChatBox from "./components/ChatBox";
// import { Toaster } from "react-hot-toast";

// // Admin imports - fixed the path casing and added missing imports
// import Layout from "./pages/Admin/Layout";
// import Dashboard from "./pages/Admin/Dashboard"; // Fixed: changed 'admin' to 'Admin' to match folder structure
// import CredentialVerify from "./pages/Admin/CredentialVerify";
// import CredentialChange from "./pages/Admin/CredentialChange";
// import AllListings from "./pages/Admin/AllListings";
// import Transactions from "./pages/Admin/Transactions";
// import Withdrawal from "./pages/Admin/Withdrawal";
// import { useAuth, useUser } from "@clerk/clerk-react";
// import { useDispatch } from "react-redux";
// import {
// 	getAllPublicListing,
// 	getAllUserListing,
// } from "./app/features/listingSlice";

// const App = () => {
// 	const { pathname } = useLocation();
// 	const { getToken } = useAuth();
// 	const { user, isLoaded } = useUser();
// 	const dispatch = useDispatch();

// 	useEffect(() => {
// 		dispatch(getAllPublicListing());
// 	}, []);

// 	useEffect(() => {
// 		if (isLoaded && user) {
// 			dispatch(getAllUserListing({ getToken }));
// 		}
// 	}, [isLoaded, user]);

// 	return (
// 		<div>
// 			<Toaster />
// 			{/* Hide Navbar on admin pages */}
// 			{!pathname.includes("/admin") && <Navbar />}

// 			<Routes>
// 				<Route path="/" element={<Home />} />
// 				<Route path="/marketplace" element={<MarketPlace />} />
// 				<Route path="/my-listings" element={<MyListing />} />
// 				<Route path="/listing/:listingId" element={<ListingDetails />} />
// 				<Route path="/create-listing" element={<ManageListing />} />
// 				<Route path="/edit-listing/:id" element={<ManageListing />} />
// 				<Route path="/messages" element={<Messages />} />
// 				<Route path="/my-orders" element={<MyOrders />} />
// 				<Route path="/loading" element={<Loading />} />

// 				{/* Admin Routes */}
// 				<Route path="/admin" element={<Layout />}>
// 					<Route index element={<Dashboard />} />
// 					<Route path="verify-credentials" element={<CredentialVerify />} />
// 					<Route path="change-credentials" element={<CredentialChange />} />
// 					<Route path="list-listings" element={<AllListings />} />
// 					<Route path="transactions" element={<Transactions />} />
// 					<Route path="withdrawal" element={<Withdrawal />} />
// 				</Route>
// 			</Routes>

// 			<ChatBox />
// 		</div>
// 	);
// };

// export default App;
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import MarketPlace from "./pages/MarketPlace";
import MyListing from "./pages/MyListing";
import ListingDetails from "./pages/ListingDetails";
import ManageListing from "./pages/ManageListing";
import Messages from "./pages/Messages";
import MyOrders from "./pages/MyOrders";
import Loading from "./pages/Loading";
import Navbar from "./components/Navbar";
import ChatBox from "./components/ChatBox";
import { Toaster } from "react-hot-toast";

import Layout from "./pages/Admin/Layout";
import Dashboard from "./pages/Admin/Dashboard";
import CredentialVerify from "./pages/Admin/CredentialVerify";
import CredentialChange from "./pages/Admin/CredentialChange";
import AllListings from "./pages/Admin/AllListings";
import Transactions from "./pages/Admin/Transactions";
import Withdrawal from "./pages/Admin/Withdrawal";
import { useAuth } from "./context/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import { useDispatch } from "react-redux";
import {
	getAllPublicListing,
	getAllUserListing,
} from "./app/features/listingSlice";

const App = () => {
	const { pathname } = useLocation();
	const { user, isLoaded } = useAuth();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllPublicListing());
	}, []);

	useEffect(() => {
		if (isLoaded && user) {
			dispatch(getAllUserListing());
		}
	}, [isLoaded, user]);

	return (
		<div>
			<Toaster />
			{!pathname.includes("/admin") && <Navbar />}

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/marketplace" element={<MarketPlace />} />
				<Route path="/my-listings" element={<MyListing />} />
				<Route path="/listing/:listingId" element={<ListingDetails />} />
				<Route path="/create-listing" element={<ManageListing />} />
				<Route path="/edit-listing/:id" element={<ManageListing />} />
				<Route path="/messages" element={<Messages />} />
				<Route path="/my-orders" element={<MyOrders />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/verify-otp" element={<VerifyOtp />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route path="/loading/:nextUrl" element={<Loading />} />

				{/* Admin Routes */}
				<Route path="/admin" element={<Layout />}>
					<Route index element={<Dashboard />} />
					<Route path="verify-credentials" element={<CredentialVerify />} />
					<Route path="change-credentials" element={<CredentialChange />} />
					<Route path="list-listings" element={<AllListings />} />
					<Route path="transactions" element={<Transactions />} />
					<Route path="withdrawal" element={<Withdrawal />} />
				</Route>
			</Routes>

			<ChatBox />
		</div>
	);
};

export default App;
