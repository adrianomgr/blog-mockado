import { NotificationTypeEnum } from './domain/enum/notification-type.enum';
import { PostStatusEnum } from './domain/enum/post-status.enum';
import { ProfileEnum } from './domain/enum/profile.enum';
import { TagSeverityEnum } from './domain/enum/tag-severity.enum';

export class Constants {
  public static readonly descricoesProfile = {
    [ProfileEnum.ADMIN]: 'Administrador',
    [ProfileEnum.AUTHOR]: 'Autor',
    [ProfileEnum.EDITOR]: 'Editor',
  };

  public static readonly severityProfile = {
    [ProfileEnum.ADMIN]: TagSeverityEnum.DANGER,
    [ProfileEnum.AUTHOR]: TagSeverityEnum.SUCCESS,
    [ProfileEnum.EDITOR]: TagSeverityEnum.INFO,
  };

  public static readonly descricoesPostStatus = {
    [PostStatusEnum.DRAFT]: 'Rascunho',
    [PostStatusEnum.PUBLISHED]: 'Publicado',
  };

  public static readonly severityPostStatus = {
    [PostStatusEnum.DRAFT]: TagSeverityEnum.INFO,
    [PostStatusEnum.PUBLISHED]: TagSeverityEnum.SUCCESS,
  };

  public static readonly iconsNotification = {
    [NotificationTypeEnum.NEW_POST]: 'pi pi-file-edit',
    [NotificationTypeEnum.NEW_USER]: 'pi pi-user-plus',
  };
}
