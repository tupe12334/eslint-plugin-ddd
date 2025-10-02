import { describe, it, expect } from 'vitest';
import { OrderService } from './order-service.js';

describe('OrderService', () => {
  it('should create an order', () => {
    const service = new OrderService();
    const order = service.createOrder('user-123', ['item1', 'item2']);
    expect(order.id).toBe('123');
    expect(order.userId).toBe('user-123');
    expect(order.items).toEqual(['item1', 'item2']);
  });
});
