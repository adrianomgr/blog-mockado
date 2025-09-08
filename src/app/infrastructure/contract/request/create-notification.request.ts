import { NotificationTypeEnum } from '@app/domain/enum/notification-type.enum';

export class CreateNotificationRequest {
  type!: NotificationTypeEnum;
  title!: string;
  message!: string;

  constructor(dados: CreateNotificationRequest) {
    this.type = dados.type;
    this.title = dados.title;
    this.message = dados.message;
  }
}
