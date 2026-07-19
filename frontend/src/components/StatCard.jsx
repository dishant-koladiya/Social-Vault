import React from "react";

const StatCard = ({ title, value, icon, color }) => {
	const colorMap = {
		indigo: "bg-indigo-100 text-indigo-600",
		green: "bg-green-100 text-green-600",
		yellow: "bg-yellow-100 text-yellow-600",
		red: "bg-red-100 text-red-600",
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-2xl font-bold text-gray-800">{value}</p>
				</div>

				<div
					className={`size-12 ${
						colorMap[color] || "bg-gray-100 text-gray-600"
					} rounded-full flex items-center justify-center`}
				>
					{icon}
				</div>
			</div>
		</div>
	);
};

export default StatCard;
