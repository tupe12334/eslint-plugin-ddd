// This file only contains types - no logic, so no spec file is required
export interface User {
  id: string;
  name: string;
  email: string;
}

export type UserId = string;

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}
