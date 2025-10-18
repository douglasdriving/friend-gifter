export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword extends Omit<User, 'updatedAt'> {}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserWithoutPassword;
  token: string;
}
