export class UserCreate {
  id: number;
  username: string;
  password: string;
  email: string;
  role: string;
  name: string;

  constructor(
    id: number,
    username: string,
    password: string,
    email: string,
    role: string,
    name: string
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
    this.name = name;
  }
}
