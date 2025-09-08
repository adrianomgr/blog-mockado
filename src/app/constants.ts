import { NotificationTypeEnum } from './domain/enum/notification-type.enum';
import { ProfileEnum } from './domain/enum/profile.enum';

export class Constants {
  public static readonly descricoesProfile = {
    [ProfileEnum.ADMIN]: 'Administrador',
    [ProfileEnum.AUTHOR]: 'Autor',
    [ProfileEnum.EDITOR]: 'Editor',
    [ProfileEnum.SUBSCRIBER]: 'Assinante',
  };

  public static readonly iconsNotification = {
    [NotificationTypeEnum.NEW_POST]: 'pi pi-file-edit',
    [NotificationTypeEnum.NEW_USER]: 'pi pi-user-plus',
  };
}
