import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../features/bookingSlice";

const statusStyles = {
  confirmed: "bg-green-100 border-green-400 text-green-800",
  pending: "bg-yellow-100 border-yellow-400 text-yellow-800",
  cancelled: "bg-red-100 border-red-400 text-red-800",
  default: "bg-gray-100 border-gray-300 text-gray-800",
};

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, bookingLoading } = useSelector((state) => state.booking);

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 4;

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  if (bookingLoading) return <p>Loading...</p>;
  if (!bookings || bookings.length === 0) return <p>No bookings found</p>;

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">My Bookings</h2>

      <ul className="space-y-3">
        {currentBookings.map((b) => {
          const style =
            statusStyles[b.status.toLowerCase()] || statusStyles.default;

          return (
            <li
              key={b._id}
              className={`border p-3 rounded-md shadow-sm ${style}`}
            >
              <p>
                <strong>Advocate:</strong>{" "}
                {b.advocate?.name || b.advocate?.user?.name}
              </p>
              <p>
                <strong>Date:</strong> {new Date(b.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Slot:</strong> {b.slot}
              </p>
              <p>
                <strong>Status:</strong> {b.status}
              </p>
            </li>
          );
        })}
      </ul>

      {/* Pagination buttons */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
