import { ProfileEnum } from '../enum/profile.enum';

export class User {
  id: number;
  username: string;
  email: string;
  role: ProfileEnum;
  name: string;
  createdAt?: string | Date;

  constructor(dados: User) {
    this.id = dados.id;
    this.username = dados.username;
    this.email = dados.email;
    this.role = dados.role;
    this.name = dados.name;
    this.createdAt = dados.createdAt;
  }
}
