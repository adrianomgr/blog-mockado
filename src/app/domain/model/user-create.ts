export class UserCreate {
  username: string;
  password: string;
  email: string;
  role: string;
  name: string;
  createdAt?: string | Date;

  constructor(
    username: string,
    password: string,
    email: string,
    role: string,
    name: string,
    createdAt?: string | Date
  ) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
    this.name = name;
    this.createdAt = createdAt;
  }
}
