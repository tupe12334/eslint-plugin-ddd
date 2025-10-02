// ✅ Valid: Index file with only re-exports
export * from './user.js';
export * from './product.js';
export { OrderService } from './order-service.js';
export { PaymentService as Payment } from './payment-service.js';
