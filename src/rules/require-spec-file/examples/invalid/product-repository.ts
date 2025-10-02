// ❌ This file violates the rule - no corresponding .spec.ts file exists

export class ProductRepository {
  findById(id: string) {
    return { id, name: 'Product' };
  }
}
