// import { useAuth } from "@clerk/clerk-react";
// import { X, CirclePlus } from "lucide-react";
// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import api from "../configs/axios";
// import { getAllUserListing } from "../app/features/listingSlice";

// const CredentialSubmission = ({ onClose, listing }) => {
// 	// const { getToken } = useAuth();
// 	const dispatch = useDispatch();
// 	const [newField, setNewField] = useState("");
// 	const [credential, setCredential] = useState([
// 		{
// 			type: "email",
// 			name: "Email",
// 			value: "",
// 		},
// 		{
// 			type: "password",
// 			name: "Password",
// 			value: "",
// 		},
// 	]);

// 	const handleAddField = () => {
// 		const name = newField.trim();
// 		if (!name) return toast.error("Please enter a field name");
// 		setCredential((prev) => [...prev, { type: "text", name, value: "" }]);
// 		setNewField("");
// 	};

// 	const handleSubmission = async (e) => {
// 		e.preventDefault();
// 		// Validate all fields are filled
// 		try {
// 			if (credential.length === 0) {
// 				return toast.error("please add at least one field");
// 			}

// 			for (const cred of credential) {
// 				if (!cred.value) {
// 					return toast.error(`please fill in the ${cred.name} field`);
// 				}
// 			}
// 			const confirm = window.confirm(
// 				"credential will be verfied & changed post submission. Are you sure you want to submit?",
// 			console.log(error);
// 		}
// 	};

// 	return (
// 		<div className="fixed inset-0 z-[100]">
// 			{/* Backdrop */}
// 			<div
// 				className="fixed inset-0 bg-black/70 backdrop-blur-sm bg-opacity-50"
// 				onClick={onClose}
// 			/>

// 			{/* Modal */}
// 			<div className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
// 				<div className="bg-white sm:rounded-lg shadow-2xl w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col pointer-events-auto">
// 					{/* Header */}
// 					<div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between flex-shrink-0">
// 						<div className="flex-1 min-w-0">
// 							<h3 className="font-semibold text-base sm:text-lg truncate">
// 								{listing?.title || "Add Credentials"}
// 							</h3>
// 							<p className="text-xs sm:text-sm text-indigo-100 truncate">
// 								Adding Credentials for @{listing?.username || "user"} on{" "}
// 								{listing?.platform || "platform"}
// 							</p>
// 						</div>
// 						<button
// 							onClick={onClose}
// 							className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
// 						>
// 							<X className="w-5 h-5" />
// 						</button>
// 					</div>

// 					{/* Form */}
// 					<form
// 						onSubmit={handleSubmission}
// 						className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 overflow-y-auto flex-1"
// 					>
// 						{credential.map((cred, index) => (
// 							<div
// 								key={index}
// 								className="flex flex-col sm:grid sm:grid-cols-[2fr_3fr_1fr] gap-1 sm:gap-2 w-full"
// 							>
// 								<label className="text-xs sm:text-sm font-medium text-gray-800">
// 									{cred.name}
// 								</label>
// 								<div className="flex items-center gap-2 sm:gap-0">
// 									<input
// 										type={cred.type}
// 										value={cred.value}
// 										onChange={(e) =>
// 											setCredential((prev) =>
// 												prev.map((c, i) =>
// 													i === index ? { ...c, value: e.target.value } : c,
// 												),
// 											)
// 										}
// 										className="flex-1 w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
// 										placeholder={`Enter ${cred.name.toLowerCase()}`}
// 										required
// 									/>
// 									{credential.length > 1 && (
// 										<X
// 											className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-0 text-gray-500 hover:text-gray-700 cursor-pointer flex-shrink-0 sm:justify-self-end"
// 											onClick={() =>
// 												setCredential((prev) =>
// 													prev.filter((_, i) => i !== index),
// 												)
// 											}
// 										/>
// 									)}
// 								</div>
// 							</div>
// 						))}

// 						{/* Add more field */}
// 						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2">
// 							<input
// 								type="text"
// 								value={newField}
// 								onChange={(e) => setNewField(e.target.value)}
// 								placeholder="Enter new field name..."
// 								className="w-full sm:w-48 outline-none border-b border-gray-200 focus:border-indigo-400 px-1 py-1.5 text-sm"
// 							/>
// 							<button
// 								type="button"
// 								onClick={handleAddField}
// 								className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors"
// 							>
// 								<CirclePlus className="w-4 h-4 sm:w-5 sm:h-5" />
// 								<span>Add Field</span>
// 							</button>
// 						</div>

// 						{/* Submit Button */}
// 						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
// 							<button
// 								type="submit"
// 								className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
// 							>
// 								Submit Credentials
// 							</button>
// 							<button
// 								type="button"
// 								onClick={onClose}
// 								className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
// 							>
// 								Cancel
// 							</button>
// 						</div>
// 					</form>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default CredentialSubmission;
import { X, CirclePlus } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import api from "../configs/axios";
import { getAllUserListing } from "../app/features/listingSlice";

const CredentialSubmission = ({ onClose, listing }) => {
	const dispatch = useDispatch();
	const [newField, setNewField] = useState("");
	const [credential, setCredential] = useState([
		{
			type: "email",
			name: "Email",
			value: "",
		},
		{
			type: "password",
			name: "Password",
			value: "",
		},
	]);

	const handleAddField = () => {
		const name = newField.trim();
		if (!name) return toast.error("Please enter a field name");
		setCredential((prev) => [...prev, { type: "text", name, value: "" }]);
		setNewField("");
	};

	const handleSubmission = async (e) => {
		e.preventDefault();
		try {
			if (credential.length === 0) {
				return toast.error("please add at least one field");
			}

			for (const cred of credential) {
				if (!cred.value) {
					return toast.error(`please fill in the ${cred.name} field`);
				}
			}
			const confirm = window.confirm(
				"credential will be verfied & changed post submission. Are you sure you want to submit?",
			);

			if (!confirm) return;

			const { data } = await api.post(
				"/api/listing/add-credential",
				{ credential, listingId: listing.id }
			);
			toast.success(data.message);
			dispatch(getAllUserListing());
			onClose();
		} catch (error) {
			toast.error(error?.response?.data?.message || error?.message);
			console.log(error);
		}
	};

	return (
		<div className="fixed inset-0 z-[100]">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/70 backdrop-blur-sm bg-opacity-50"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
				<div className="bg-white sm:rounded-lg shadow-2xl w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col pointer-events-auto">
					{/* Header */}
					<div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between flex-shrink-0">
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-base sm:text-lg truncate">
								{listing?.title || "Add Credentials"}
							</h3>
							<p className="text-xs sm:text-sm text-indigo-100 truncate">
								Adding Credentials for @{listing?.username || "user"} on{" "}
								{listing?.platform || "platform"}
							</p>
						</div>
						<button
							onClick={onClose}
							className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Form */}
					<form
						onSubmit={handleSubmission}
						className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 overflow-y-auto flex-1"
					>
						{credential.map((cred, index) => (
							<div
								key={index}
								className="flex flex-col sm:grid sm:grid-cols-[2fr_3fr_1fr] gap-1 sm:gap-2 w-full"
							>
								<label className="text-xs sm:text-sm font-medium text-gray-800">
									{cred.name}
								</label>
								<div className="flex items-center gap-2 sm:gap-0">
									<input
										type={cred.type}
										value={cred.value}
										onChange={(e) =>
											setCredential((prev) =>
												prev.map((c, i) =>
													i === index ? { ...c, value: e.target.value } : c,
												),
											)
										}
										className="flex-1 w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
										placeholder={`Enter ${cred.name.toLowerCase()}`}
										required
									/>
									{credential.length > 1 && (
										<X
											className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-0 text-gray-500 hover:text-gray-700 cursor-pointer flex-shrink-0 sm:justify-self-end"
											onClick={() =>
												setCredential((prev) =>
													prev.filter((_, i) => i !== index),
												)
											}
										/>
									)}
								</div>
							</div>
						))}

						{/* Add more field */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2">
							<input
								type="text"
								value={newField}
								onChange={(e) => setNewField(e.target.value)}
								placeholder="Enter new field name..."
								className="w-full sm:w-48 outline-none border-b border-gray-200 focus:border-indigo-400 px-1 py-1.5 text-sm"
							/>
							<button
								type="button"
								onClick={handleAddField}
								className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors"
							>
								<CirclePlus className="w-4 h-4 sm:w-5 sm:h-5" />
								<span>Add Field</span>
							</button>
						</div>

						{/* Submit Button */}
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
							<button
								type="submit"
								className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
							>
								Submit Credentials
							</button>
							<button
								type="button"
								onClick={onClose}
								className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CredentialSubmission;
