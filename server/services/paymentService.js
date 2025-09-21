const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_KEY);

// Create a payment intent
const createPaymentIntent = async (amount, currency = "usd") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency,
      payment_method_types: ["card"],
    });

    return paymentIntent;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = createPaymentIntent;