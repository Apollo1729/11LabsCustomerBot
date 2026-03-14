"use client";

import { useState } from "react";
import { makeOutboundCall } from "./outbound-call-action";

export function OutboundCall() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic phone number validation
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage({ type: "error", text: "Please enter a valid phone number" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await makeOutboundCall(phoneNumber);

      if (result.success) {
        setMessage({ type: "success", text: "Call initiated successfully!" });
        setPhoneNumber("");
      } else {
        setMessage({ type: "error", text: result.error || "Failed to make call" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Make Outbound Call</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="phone-number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 blur-[5px]"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter phone number with country code (e.g., +1234567890)
            </p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded font-medium text-sm transition-colors ${
              isLoading
                ? "!bg-gray-100 !text-gray-400 cursor-not-allowed"
                : "!bg-blue-600 !text-white hover:!bg-blue-700"
            }`}
          >
            {isLoading ? "Calling..." : "Call Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
