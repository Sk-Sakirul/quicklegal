// src/pages/Admin/BookingStats.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingStats } from "../../features/adminSlice";

const BookingStats = () => {
  const dispatch = useDispatch();
  const { bookingStats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchBookingStats());
  }, [dispatch]);

  if (loading) return <p>Loading booking stats...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!bookingStats) return <p>No booking data available.</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Booking Statistics</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium">Total Revenue</h3>
        <p className="text-xl font-bold">${bookingStats.totalRevenue || 0}</p>
      </div>

      <h3 className="text-lg font-medium mb-2">Bookings Per Week</h3>
      {bookingStats.bookingsPerWeek.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Week</th>
              <th className="border px-4 py-2">Total Bookings</th>
            </tr>
          </thead>
          <tbody>
            {bookingStats.bookingsPerWeek.map((week) => (
              <tr key={week._id}>
                <td className="border px-4 py-2">{week._id}</td>
                <td className="border px-4 py-2">{week.totalBookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingStats;
