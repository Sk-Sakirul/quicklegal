import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchAdvocateBookings } from "../../redux/bookingSlice";
import { toast } from "react-toastify";
import { fetchAdvocateBookings } from "../../features/bookingSlice";

const AdvocateBookings = () => {
  const dispatch = useDispatch();
  const { advocateBookings, bookingLoading, bookingError } = useSelector(
    (state) => state.booking
  );
  const { user } = useSelector((state) => state.auth); // assuming auth slice

  useEffect(() => {
    if (user && user.role === "advocate") {
      dispatch(fetchAdvocateBookings()); // no ID needed
    } else {
      toast.error("Access denied");
    }
  }, [dispatch, user]);

  if (bookingLoading) return <p>Loading bookings...</p>;
  if (bookingError) return <p className="text-red-500">{bookingError}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
      {advocateBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Booking ID</th>
              <th className="border px-4 py-2">Client Name</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Slot</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {advocateBookings.map((booking) => (
              <tr key={booking._id}>
                <td className="border px-4 py-2">{booking._id}</td>
                <td className="border px-4 py-2">{booking.user?.name}</td>
                <td className="border px-4 py-2">
                  {new Date(booking.date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{booking.slot}</td>
                <td className="border px-4 py-2">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdvocateBookings;
