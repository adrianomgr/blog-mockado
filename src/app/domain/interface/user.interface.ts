import { ProfileEnum } from '../enum/profile.enum';

export interface User {
  id: number;
  username: string;
  email: string;
  role: ProfileEnum;
  name: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  name: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  name?: string;
}
