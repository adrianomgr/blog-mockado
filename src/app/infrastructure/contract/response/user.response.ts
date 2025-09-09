import { ProfileEnum } from '@app/domain/enum/profile.enum';
import { User } from '@app/domain/model/user';
import { UserStatistics } from '@app/domain/model/user-statistics';

export class UserResponse {
  id!: number;
  username!: string;
  email!: string;
  password?: string; // para fins de teste
  role!: string;
  name!: string;
  createdAt?: string | Date;

  static converterLista(dados: UserResponse[]): User[] {
    return dados.map((item) => ({
      id: item.id,
      username: item.username,
      email: item.email,
      password: item.password,
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
      password: dados.password,
      role: dados.role as ProfileEnum,
      name: dados.name,
      createdAt: dados.createdAt,
    };
  }

  static convertToStatistics(dados: UserResponse[]): UserStatistics {
    const statistics = new UserStatistics();

    statistics.totalUsers = dados.length;
    statistics.adminCount = dados.filter((user) => user.role === 'admin').length;
    statistics.editorCount = dados.filter((user) => user.role === 'editor').length;
    statistics.authorCount = dados.filter((user) => user.role === 'author').length;

    return statistics;
  }
}
