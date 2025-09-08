import { NotificationSeverityEnum } from '../enum/notification-severity.enum';
import { NotificationTypeEnum } from '../enum/notification-type.enum';

export class Notification {
  id: number;
  type: NotificationTypeEnum;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  severity: NotificationSeverityEnum;

  constructor(dados: Notification) {
    this.id = dados.id;
    this.type = dados.type;
    this.title = dados.title;
    this.message = dados.message;
    this.timestamp = dados.timestamp;
    this.read = dados.read;
    this.icon = dados.icon;
    this.severity = dados.severity;
  }
}
