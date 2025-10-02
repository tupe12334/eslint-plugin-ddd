import { describe, it, expect } from 'vitest';
import { UserService } from './user-service.js';

describe('UserService', () => {
  it('should get user by id', () => {
    const service = new UserService();
    const user = service.getUser('123');
    expect(user).toEqual({ id: '123', name: 'John Doe' });
  });
});
