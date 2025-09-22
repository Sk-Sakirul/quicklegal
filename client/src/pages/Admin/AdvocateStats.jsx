// src/pages/Admin/AdvocateStats.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdvocateStats } from "../../features/adminSlice";

const AdvocateStats = () => {
  const dispatch = useDispatch();
  const { advocateStats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdvocateStats());
  }, [dispatch]);

  if (loading) return <p>Loading advocate stats...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!advocateStats || !advocateStats.advocates)
    return <p>No data available.</p>;

  // Map advocateBookings by advocate _id for easy lookup
  const bookingsMap = {};
  advocateStats.advocateBookings.forEach((b) => {
    bookingsMap[b._id] = b;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Advocate Stats</h2>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Advocate ID</th>
            <th className="border px-4 py-2">Specialization</th>
            <th className="border px-4 py-2">Hourly Rate</th>
            <th className="border px-4 py-2">Total Bookings</th>
            <th className="border px-4 py-2">Confirmed Bookings</th>
          </tr>
        </thead>
        <tbody>
          {advocateStats.advocates.map((adv) => {
            const booking = bookingsMap[adv._id] || {
              totalBookings: 0,
              confirmedBookings: 0,
            };
            return (
              <tr key={adv._id}>
                <td className="border px-4 py-2">{adv._id}</td>
                <td className="border px-4 py-2">{adv.specialization}</td>
                <td className="border px-4 py-2">{adv.hourlyRate}</td>
                <td className="border px-4 py-2">{booking.totalBookings}</td>
                <td className="border px-4 py-2">
                  {booking.confirmedBookings}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdvocateStats;
