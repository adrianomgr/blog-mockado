import { NotificationSeverityEnum } from '@app/domain/enum/notification-severity.enum';
import { NotificationTypeEnum } from '@app/domain/enum/notification-type.enum';
import { Notification } from '@app/domain/model/notification';

export class NotificationResponse {
  id!: number;
  type!: NotificationTypeEnum;
  title!: string;
  message!: string;
  timestamp!: string;
  read!: boolean;
  icon!: string;
  severity!: NotificationSeverityEnum;

  static converter(dados: NotificationResponse[]): Notification[] {
    return dados
      .map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        timestamp: item.timestamp,
        read: item.read,
        icon: item.icon,
        severity: item.severity,
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
