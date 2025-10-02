// ❌ Invalid: This directory has multiple files but no index file
export class UserService {
  getUser(id) {
    return { id, name: 'John Doe' };
  }
}
