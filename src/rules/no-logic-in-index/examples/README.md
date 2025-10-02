# no-logic-in-index Examples

## Valid Examples

**Pure re-export index file:**
```javascript
// ✅ valid/index.js
export * from './user.js';
export * from './product.js';
export { OrderService } from './order-service.js';
export { PaymentService as Payment } from './payment-service.js';
```

**Index file with constants:**
```javascript
// ✅ valid/index-with-constants.js
export const API_VERSION = '1.0.0';
export const MAX_RETRY_COUNT = 3;

export * from './services.js';
export * from './models.js';
```

## Invalid Examples

**Index file with function logic:**
```javascript
// ❌ invalid/index-with-function.js
export * from './user.js';

// This function should be in its own file
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Index file with class logic:**
```javascript
// ❌ invalid/index-with-class.js
export * from './domain.js';

// This class should be in its own file
export class UserValidator {
  validate(user) {
    return user.name && user.email;
  }
}
```

**Index file with arrow function logic:**
```javascript
// ❌ invalid/index-with-arrow-function.js
export * from './services.js';

// This helper should be in its own file
export const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};
```

## Rule Behavior

Index files should act as "barrel files" that only re-export from other modules. This keeps them clean and easy to understand.

**Allowed in index files:**
- `export * from './module'` - Re-export all
- `export { Thing } from './module'` - Named re-export
- `export { Thing as OtherThing } from './module'` - Renamed re-export
- `export const CONSTANT = 'value'` - Simple constants

**Not allowed in index files:**
- Functions with implementation
- Classes with methods
- Arrow functions with logic
- Any executable code beyond simple constants

**Why this rule?**
- Keeps index files focused on organization, not implementation
- Makes it clear where logic lives in your codebase
- Prevents index files from becoming dumping grounds
- Follows DDD principle of clear separation of concerns
