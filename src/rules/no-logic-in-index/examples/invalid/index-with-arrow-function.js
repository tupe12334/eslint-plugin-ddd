// ❌ Invalid: Index file contains arrow function with logic
export * from './services.js';

// This helper should be in its own file
export const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

export * from './utils.js';
