import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import api from "../configs/axios";
import AdminSidebar from "./admin/AdminSidebar";
import AdminNavbar from "./admin/AdminNavbar";

const AdminRoute = () => {
	const { user, isLoaded } = useAuth();
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAdmin = async () => {
			try {
				const { data } = await api.get("/api/admin/isAdmin");
				setIsAdmin(data.isAdmin);
			} catch {
				setIsAdmin(false);
			} finally {
				setIsLoading(false);
			}
		};

		if (user) {
			checkAdmin();
		} else if (isLoaded) {
			setIsLoading(false);
		}
	}, [user, isLoaded]);

	if (!isLoaded || isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2Icon className="size-7 text-indigo-500 animate-spin" />
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/sign-in" replace />;
	}

	if (!isAdmin) {
		return <Navigate to="/" replace />;
	}

	return (
		<>
			<AdminNavbar />
			<div className="flex">
				<AdminSidebar />
				<div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] bg-slate-50 overflow-y-auto">
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default AdminRoute;
