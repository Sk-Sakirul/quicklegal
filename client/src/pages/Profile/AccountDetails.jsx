import React from "react";
import { useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaIdBadge } from "react-icons/fa";

const AccountDetails = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-50 to-indigo-100 shadow-lg rounded-xl p-8 mt-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
        Account Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Name */}
        <div className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <div className="text-indigo-600 mr-4 text-2xl">
            <FaUser />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="text-lg font-semibold">{user?.name || "-"}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <div className="text-indigo-600 mr-4 text-2xl">
            <FaEnvelope />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-lg font-semibold">{user?.email || "-"}</p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <div className="text-indigo-600 mr-4 text-2xl">
            <FaIdBadge />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <p className="text-lg font-semibold capitalize">
              {user?.role || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
