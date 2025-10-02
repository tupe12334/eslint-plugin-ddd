// ❌ Invalid: This directory has multiple files but no index file
export class ProductService {
  getProduct(id) {
    return { id, name: 'Product', price: 100 };
  }
}
