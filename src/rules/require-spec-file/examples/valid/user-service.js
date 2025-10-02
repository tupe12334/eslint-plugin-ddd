export class UserService {
  getUser(id: string) {
    return { id, name: 'John Doe' };
  }
}
