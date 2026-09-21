import { X, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import React from "react";

const EarningsModal = ({ onClose, earnings = 0, currency = "$", userListings = [] }) => {
  const soldListings = userListings.filter((listing) => listing.status === "sold");

  const totalSoldValue = soldListings.reduce((sum, listing) => sum + (listing.price || 0), 0);

  return (
    <div className="z-[100] fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-4 rounded-t-xl flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-semibold text-lg">Earnings Breakdown</h3>
            <p className="text-sm text-green-100">View your earnings from sold listings</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Earnings Banner */}
        <div className="bg-green-50 border-b border-green-100 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-green-700">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Total Earned</span>
          </div>
          <span className="text-xl font-bold text-green-700">{currency}{earnings.toFixed(2)}</span>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          {soldListings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-600">No earnings yet</p>
              <p className="text-sm text-gray-500 mt-1">Your earnings will appear here when listings are sold</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-medium text-gray-600 pb-2 border-b border-gray-100">
                <span>Listing</span>
                <span>Amount</span>
              </div>
              {soldListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{listing.title}</p>
                      <p className="text-xs text-gray-500">@{listing.username} • {listing.platform}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">{currency}{listing.price?.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-gray-100">
                <span className="font-medium text-gray-800">Total from {soldListings.length} sold listing(s)</span>
                <span className="text-lg font-bold text-green-600">{currency}{totalSoldValue.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningsModal;