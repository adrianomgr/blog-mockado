import { ProfileEnum } from '@app/domain/enum/profile.enum';
import { User } from '@app/domain/model/user';

export class UserResponse {
  id!: number;
  username!: string;
  email!: string;
  role!: string;
  name!: string;
  createdAt?: string | Date;

  static converterLista(dados: UserResponse[]): User[] {
    return dados.map((item) => ({
      id: item.id,
      username: item.username,
      email: item.email,
      role: item.role as ProfileEnum,
      name: item.name,
      createdAt: item.createdAt,
    }));
  }

  static converter(dados: UserResponse): User {
    return {
      id: dados.id,
      username: dados.username,
      email: dados.email,
      role: dados.role as ProfileEnum,
      name: dados.name,
      createdAt: dados.createdAt,
    };
  }
}
