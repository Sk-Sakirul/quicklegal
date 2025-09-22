// utils/validators.js

// Email validation
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password validation (min 6 chars)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Required field validation
export const isRequired = (value) => {
  return (
    value !== undefined && value !== null && value.toString().trim() !== ""
  );
};

// Case form validation
export const validateCaseForm = ({ title, description, tags }) => {
  const errors = {};

  if (!isRequired(title)) errors.title = "Title is required";
  if (!isRequired(description)) errors.description = "Description is required";
  if (!tags || !Array.isArray(tags) || tags.length === 0)
    errors.tags = "At least one tag is required";

  return errors;
};

// Booking form validation
export const validateBookingForm = ({ date, slot }) => {
  const errors = {};

  if (!isRequired(date)) errors.date = "Date is required";
  if (!isRequired(slot)) errors.slot = "Slot is required";

  return errors;
};
