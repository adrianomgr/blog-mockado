import { ProfileEnum } from '@app/domain/enum/profile.enum';
import { Login } from '@app/domain/model/login';

export class LoginResponse {
  success!: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
    name: string;
    imgBase64?: string;
  };
  message?: string;

  static converter(dados: LoginResponse): Login {
    return new Login({
      success: dados.success,
      token: dados.token,
      user: dados.user
        ? {
            ...dados.user,
            role: dados.user.role as ProfileEnum,
          }
        : undefined,
      message: dados.message,
    });
  }
}
