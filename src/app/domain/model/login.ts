import { User } from './user';

export class Login {
  success!: boolean;
  token?: string;
  user?: User;
  message?: string;

  constructor(dados: Login) {
    this.success = dados.success;
    this.token = dados.token;
    this.user = dados.user;
    this.message = dados.message;
  }
}
