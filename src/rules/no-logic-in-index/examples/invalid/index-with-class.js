// ❌ Invalid: Index file contains a class with methods
export * from './domain.js';

// This class should be in its own file
export class UserValidator {
  validate(user) {
    return user.name && user.email;
  }
}
