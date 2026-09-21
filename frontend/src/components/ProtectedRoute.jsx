import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2Icon } from "lucide-react";

const ProtectedRoute = ({ children }) => {
	const { user, isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<div className="h-[80vh] flex items-center justify-center">
				<Loader2Icon className="size-7 animate-spin text-indigo-600" />
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/sign-in" replace />;
	}

	return children;
};

export default ProtectedRoute;
