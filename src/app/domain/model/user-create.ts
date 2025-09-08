export class UserCreate {
  id: number;
  username: string;
  password: string;
  email: string;
  role: string;
  name: string;
  createdAt?: string | Date;

  constructor(
    id: number,
    username: string,
    password: string,
    email: string,
    role: string,
    name: string,
    createdAt?: string | Date
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
    this.name = name;
    this.createdAt = createdAt;
  }
}
