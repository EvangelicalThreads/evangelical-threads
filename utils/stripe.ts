// utils/stripe.js
import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe("pk_test_YOUR_PUBLIC_KEY"); // you'll replace this later
  }
  return stripePromise;
};
