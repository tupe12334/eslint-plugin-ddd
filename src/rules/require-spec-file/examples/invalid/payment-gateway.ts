// ❌ This file violates the rule - no corresponding .spec.ts file exists

export class PaymentGateway {
  processPayment(amount: number): boolean {
    return amount > 0;
  }
}
