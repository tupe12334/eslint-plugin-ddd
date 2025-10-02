export class OrderService {
  createOrder(userId: string, items: string[]): { id: string; userId: string; items: string[] } {
    return { id: '123', userId, items };
  }
}
