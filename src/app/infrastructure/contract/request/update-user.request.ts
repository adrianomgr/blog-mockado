export class UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  name?: string;

  constructor(dados: UpdateUserRequest) {
    this.username = dados.username;
    this.email = dados.email;
    this.password = dados.password;
    this.role = dados.role;
    this.name = dados.name;
  }
}
