import { ProfileEnum } from './domain/enum/profile.enum';

export class Constants {
  public static readonly descricoesProfile = {
    [ProfileEnum.ADMIN]: 'Administrador',
    [ProfileEnum.AUTHOR]: 'Autor',
    [ProfileEnum.EDITOR]: 'Editor',
    [ProfileEnum.SUBSCRIBER]: 'Assinante',
  };
}
