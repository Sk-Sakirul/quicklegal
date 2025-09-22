// src/pages/Admin/PopularCases.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularCases } from "../../features/adminSlice";

const PopularCases = () => {
  const dispatch = useDispatch();
  const { popularCases, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPopularCases());
  }, [dispatch]);

  if (loading) return <p>Loading popular cases...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Popular Cases</h2>
      {popularCases.length === 0 ? (
        <p>No popular cases found.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Case Type</th>
              <th className="border px-4 py-2">Number of Bookings</th>
            </tr>
          </thead>
          <tbody>
            {popularCases.map((caseItem) => (
              <tr key={caseItem._id}>
                <td className="border px-4 py-2">{caseItem._id}</td>
                <td className="border px-4 py-2">{caseItem.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PopularCases;
