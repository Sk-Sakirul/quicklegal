const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        advocate: {type: mongoose.Schema.Types.ObjectId, ref: "Advocate", required: true},
        date : {type: Date, required: true},
        slot: {type: String, required: true},
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending"
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid"],
            default: "unpaid"
        }
    },
    {timestamps: true}
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;