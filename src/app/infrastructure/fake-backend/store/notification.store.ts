import { Injectable } from '@angular/core';
import { Constants } from '@app/constants';
import { NotificationSeverityEnum } from '@app/domain/enum/notification-severity.enum';
import { NotificationTypeEnum } from '@app/domain/enum/notification-type.enum';
import { Notification } from '@app/domain/model/notification';
import { NotificationsMock } from '@app/infrastructure/mock/notifications.mock';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationStore {
  private readonly mockNotifications: Notification[] = NotificationsMock as Notification[];
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>(
    this.mockNotifications
  );
  private readonly notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  get currentNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  // Método para adicionar uma nova notificação
  addNotification(notificationData: Notification): Notification {
    const currentNotifications = this.currentNotifications;
    const newId = Math.max(...currentNotifications.map((n) => n.id), 0) + 1;

    const icon = Constants.iconsNotification[notificationData.type];
    const severity =
      notificationData.type === NotificationTypeEnum.NEW_POST
        ? NotificationSeverityEnum.INFO
        : NotificationSeverityEnum.SUCCESS;

    const newNotification: Notification = {
      id: newId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      timestamp: new Date().toISOString(),
      read: false,
      icon,
      severity,
    };

    const updatedNotifications = [newNotification, ...currentNotifications];
    this.notificationsSubject.next(updatedNotifications);

    return newNotification;
  }
}
