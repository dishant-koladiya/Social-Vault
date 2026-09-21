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

import AdminRoute from "./components/AdminRoute";
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
import Profile from "./pages/Profile";
import LearnMore from "./pages/LearnMore";
import ProtectedRoute from "./components/ProtectedRoute";
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
				<Route path="/listing/:listingId" element={<ListingDetails />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/verify-otp" element={<VerifyOtp />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route path="/loading/:nextUrl" element={<Loading />} />
				<Route path="/learn-more" element={<LearnMore />} />

				{/* Protected Routes */}
				<Route path="/my-listings" element={<ProtectedRoute><MyListing /></ProtectedRoute>} />
				<Route path="/create-listing" element={<ProtectedRoute><ManageListing /></ProtectedRoute>} />
				<Route path="/edit-listing/:id" element={<ProtectedRoute><ManageListing /></ProtectedRoute>} />
				<Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
				<Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
				<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

				{/* Admin Routes */}
				<Route path="/admin" element={<AdminRoute />}>
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
