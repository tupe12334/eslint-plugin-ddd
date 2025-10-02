// ❌ Invalid: Index file contains a function with logic
export * from './user.js';

// This function should be in its own file
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

export * from './product.js';
