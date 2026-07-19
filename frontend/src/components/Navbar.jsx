// import React from "react";
// import { assets } from "../assets/assets";
// import { Link, useNavigate } from "react-router-dom";
// import {
// 	BoxIcon,
// 	GripIcon,
// 	ListIcon,
// 	MenuIcon,
// 	MessageCircleMoreIcon,
// 	XIcon,
// } from "lucide-react";
// import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

// const Navbar = () => {
// 	const { user } = useUser();
// 	const { openSignIn } = useClerk();

// 	const [menuOpen, setMenuOpen] = React.useState(false);
// 	const navigate = useNavigate();

// 	// 🔥 Close menu + scroll top
// 	const closeMenu = () => {
// 		setMenuOpen(false);
// 		window.scrollTo(0, 0);
// 	};

// 	return (
// 		<nav className="h-20">
// 			<div className="fixed left-0 top-0 right-0 z-100 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white transition-all">
// 				<img
// 					src={assets.logo}
// 					onClick={() => {
// 						navigate("/");
// 						closeMenu();
// 					}}
// 					alt="logo"
// 					className="h-10 cursor-pointer"
// 				/>

// 				{/* Desktop Menu */}
// 				<div className="hidden sm:flex items-center gap-4 md:gap-8 max-md:text-sm text-gray-800">
// 					<Link to="/" onClick={() => window.scrollTo(0, 0)}>
// 						Home
// 					</Link>
// 					<Link to="/marketplace" onClick={() => window.scrollTo(0, 0)}>
// 						Marketplace
// 					</Link>
// 					<Link
// 						to={user ? "/messages" : "#"}
// 						onClick={(e) => {
// 							if (!user) {
// 								e.preventDefault();
// 								openSignIn();
// 							} else {
// 								window.scrollTo(0, 0);
// 							}
// 						}}
// 					>
// 						Messages
// 					</Link>
// 					<Link
// 						to={user ? "/my-listings" : "#"}
// 						onClick={(e) => {
// 							if (!user) {
// 								e.preventDefault();
// 								openSignIn();
// 							} else {
// 								window.scrollTo(0, 0);
// 							}
// 						}}
// 					>
// 						My Listings
// 					</Link>
// 				</div>

// 				{/* Desktop Auth Button & Mobile Menu Icon */}
// 				<div className="flex items-center gap-2">
// 					{/* Desktop Auth */}
// 					<div className="max-sm:hidden">
// 						{user ? (
// 							<UserButton>
// 								<UserButton.MenuItems>
// 									<UserButton.Action
// 										label="Marketplace"
// 										labelIcon={<GripIcon size={16} />}
// 										onClick={() => navigate("/marketplace")}
// 									/>
// 								</UserButton.MenuItems>
// 							</UserButton>
// 						) : (
// 							<button
// 								onClick={() => openSignIn()}
// 								className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
// 							>
// 								Login
// 							</button>
// 						)}
// 					</div>

// 					{/* Mobile Auth + Menu Icon - Side by Side */}
// 					<div className="sm:hidden flex items-center gap-2">
// 						{user ? (
// 							<UserButton>
// 								<UserButton.MenuItems>
// 									<UserButton.Action
// 										label="Marketplace"
// 										labelIcon={<GripIcon size={16} />}
// 										onClick={() => navigate("/marketplace")}
// 									/>
// 								</UserButton.MenuItems>
// 								<UserButton.MenuItems>
// 									<UserButton.Action
// 										label="Messages"
// 										labelIcon={<MessageCircleMoreIcon size={16} />}
// 										onClick={() => navigate("/messages")}
// 									/>
// 								</UserButton.MenuItems>
// 								<UserButton.MenuItems>
// 									<UserButton.Action
// 										label="My Listings"
// 										labelIcon={<ListIcon size={16} />}
// 										onClick={() => navigate("/my-listings")}
// 									/>
// 								</UserButton.MenuItems>
// 								<UserButton.MenuItems>
// 									<UserButton.Action
// 										label="My Orders"
// 										labelIcon={<BoxIcon size={16} />}
// 										onClick={() => navigate("/my-orders")}
// 									/>
// 								</UserButton.MenuItems>
// 							</UserButton>
// 						) : (
// 							<button
// 								onClick={() => {
// 									openSignIn();
// 								}}
// 								className="cursor-pointer px-4 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
// 							>
// 								Login
// 							</button>
// 						)}
// 						<MenuIcon
// 							onClick={() => setMenuOpen(true)}
// 							className="cursor-pointer"
// 						/>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Mobile Menu */}
// 			<div
// 				className={`sm:hidden fixed inset-0 ${
// 					menuOpen ? "w-full" : "w-0"
// 				} overflow-hidden bg-white backdrop-blur shadow-xl rounded-lg z-[200] text-sm transition-all`}
// 			>
// 				<div className="flex flex-col items-center justify-center h-full text-xl font-semibold gap-6 p-4">
// 					<Link to="/" onClick={closeMenu}>
// 						Home
// 					</Link>
// 					<Link to="/marketplace" onClick={closeMenu}>
// 						Marketplace
// 					</Link>
// 					<Link
// 						to={user ? "/messages" : "#"}
// 						onClick={(e) => {
// 							if (!user) {
// 								e.preventDefault();
// 								openSignIn();
// 							} else {
// 								closeMenu();
// 							}
// 						}}
// 					>
// 						Messages
// 					</Link>
// 					<Link
// 						to={user ? "/my-listings" : "#"}
// 						onClick={(e) => {
// 							if (!user) {
// 								e.preventDefault();
// 								openSignIn();
// 							} else {
// 								closeMenu();
// 							}
// 						}}
// 					>
// 						My Listings
// 					</Link>

// 					{/* Remove duplicate UserButton/Login from mobile menu */}

// 					<XIcon
// 						onClick={() => setMenuOpen(false)}
// 						className="absolute size-8 right-6 top-6 text-gray-500 hover:text-gray-700 cursor-pointer"
// 					/>
// 				</div>
// 			</div>
// 		</nav>
// 	);
// };

// export default Navbar;
import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import {
	BoxIcon,
	LogOutIcon,
	MenuIcon,
	MessageCircleMoreIcon,
	UserIcon,
	ListIcon,
	XIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
	const { user, logout } = useAuth();
	const [menuOpen, setMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const closeMenu = () => {
		setMenuOpen(false);
		window.scrollTo(0, 0);
	};

	const handleLogout = async () => {
		await logout();
		setDropdownOpen(false);
		navigate("/");
	};

	return (
		<nav className="h-20">
			<div className="fixed left-0 top-0 right-0 z-100 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white transition-all">
				<img
					src={assets.logo}
					onClick={() => {
						navigate("/");
						closeMenu();
					}}
					alt="logo"
					className="h-10 cursor-pointer"
				/>

				<div className="hidden sm:flex items-center gap-4 md:gap-8 max-md:text-sm text-gray-800">
					<Link to="/" onClick={() => window.scrollTo(0, 0)}>
						Home
					</Link>
					<Link to="/marketplace" onClick={() => window.scrollTo(0, 0)}>
						Marketplace
					</Link>
					<Link
						to={user ? "/messages" : "/sign-in"}
						onClick={() => window.scrollTo(0, 0)}
					>
						Messages
					</Link>
					<Link
						to={user ? "/my-listings" : "/sign-in"}
						onClick={() => window.scrollTo(0, 0)}
					>
						My Listings
					</Link>
				</div>

				<div className="flex items-center gap-2">
					<div className="max-sm:hidden">
						{user ? (
							<div className="relative" ref={dropdownRef}>
								<button
									onClick={() => setDropdownOpen(!dropdownOpen)}
									className="flex items-center gap-2 cursor-pointer"
								>
									<img
										src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
										alt={user.name}
										className="size-9 rounded-full object-cover border-2 border-indigo-500"
									/>
								</button>
								{dropdownOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
										<div className="px-4 py-2 border-b border-gray-100">
											<p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
											<p className="text-xs text-gray-500 truncate">{user.email}</p>
										</div>
										<button
											onClick={() => { navigate("/marketplace"); setDropdownOpen(false); }}
											className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
										>
											<ListIcon size={16} /> Marketplace
										</button>
										<button
											onClick={() => { navigate("/messages"); setDropdownOpen(false); }}
											className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
										>
											<MessageCircleMoreIcon size={16} /> Messages
										</button>
										<button
											onClick={() => { navigate("/my-listings"); setDropdownOpen(false); }}
											className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
										>
											<ListIcon size={16} /> My Listings
										</button>
										<button
											onClick={() => { navigate("/my-orders"); setDropdownOpen(false); }}
											className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
										>
											<BoxIcon size={16} /> My Orders
										</button>
										<div className="border-t border-gray-100 mt-1 pt-1">
											<button
												onClick={handleLogout}
												className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
											>
												<LogOutIcon size={16} /> Logout
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<Link
								to="/sign-in"
								className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
							>
								Login
							</Link>
						)}
					</div>

					<div className="sm:hidden flex items-center gap-2">
						{user ? (
							<Link to="/sign-in">
								<img
									src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
									alt={user.name}
									className="size-8 rounded-full object-cover border-2 border-indigo-500"
								/>
							</Link>
						) : (
							<Link
								to="/sign-in"
								className="px-4 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
							>
								Login
							</Link>
						)}
						<MenuIcon
							onClick={() => setMenuOpen(true)}
							className="cursor-pointer"
						/>
					</div>
				</div>
			</div>

			<div
				className={`sm:hidden fixed inset-0 ${
					menuOpen ? "w-full" : "w-0"
				} overflow-hidden bg-white backdrop-blur shadow-xl rounded-lg z-[200] text-sm transition-all`}
			>
				<div className="flex flex-col items-center justify-center h-full text-xl font-semibold gap-6 p-4">
					<Link to="/" onClick={closeMenu}>
						Home
					</Link>
					<Link to="/marketplace" onClick={closeMenu}>
						Marketplace
					</Link>
					<Link to={user ? "/messages" : "/sign-in"} onClick={closeMenu}>
						Messages
					</Link>
					<Link to={user ? "/my-listings" : "/sign-in"} onClick={closeMenu}>
						My Listings
					</Link>
					{user && (
						<>
							<Link to="/my-orders" onClick={closeMenu}>
								My Orders
							</Link>
							<button
								onClick={handleLogout}
								className="text-red-500 cursor-pointer"
							>
								Logout
							</button>
						</>
					)}

					<XIcon
						onClick={() => setMenuOpen(false)}
						className="absolute size-8 right-6 top-6 text-gray-500 hover:text-gray-700 cursor-pointer"
					/>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
