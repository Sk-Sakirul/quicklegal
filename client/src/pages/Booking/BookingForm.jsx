import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

// Load Stripe (publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ clientSecret, bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
    } else if (paymentIntent.status === "succeeded") {
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/bookings/confirm`,
          { bookingId, paymentIntentId: paymentIntent.id },
          { withCredentials: true }
        );
        toast.success("Booking confirmed!");
        navigate("/my-bookings");
      } catch (err) {
        toast.error(err.response?.data?.message || "Confirmation failed");
      }
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md"
      >
        Pay & Confirm
      </button>
    </form>
  );
};

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const advocateId = searchParams.get("advocateId");

  const [advocate, setAdvocate] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [slots, setSlots] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  // Fetch advocate details (including availability)
  useEffect(() => {
    if (!advocateId) return;

    const fetchAdvocate = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/advocates/${advocateId}`,
          { withCredentials: true }
        );
        setAdvocate(res.data.advocate || res.data);
      } catch (err) {
        toast.error("Failed to fetch advocate details");
      }
    };

    fetchAdvocate();
  }, [advocateId]);

  // Update slots when date changes
  useEffect(() => {
    if (!date || !advocate) return;

    const availabilityForDate = advocate.availability?.find(
      (a) => new Date(a.date).toISOString().split("T")[0] === date
    );
    setSlots(availabilityForDate?.slots || []);
    setSlot(""); // reset selected slot
  }, [date, advocate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!advocateId || !slot || !date) {
      return toast.error("Select date and slot");
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/bookings`,
        { advocateId, date, slot },
        { withCredentials: true }
      );

      setClientSecret(res.data.clientSecret);
      setBookingId(res.data.bookingId);
      toast.info(res.data.message || "Proceed to payment");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      {!clientSecret ? (
        <form onSubmit={handleBooking} className="space-y-4">
          {/* Select Date */}
          <div>
            <label className="block text-sm font-medium">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Select Slot */}
          <div>
            <label className="block text-sm font-medium">Select Slot</label>
            {slots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {slots.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`px-3 py-2 rounded-md border ${
                      slot === s
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No slots available</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!slot}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Proceed to Payment
          </button>
        </form>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} bookingId={bookingId} />
        </Elements>
      )}
    </div>
  );
};

export default BookingForm;
