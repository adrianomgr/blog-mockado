import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Notification } from '@app/domain/model/notification';
import { Observable, tap } from 'rxjs';
import { CreateNotificationRequest } from '../contract/request/create-notification.request';
import { NotificationResponse } from '../contract/response/notification.response';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  private readonly apiUrl = '/api/notifications';

  constructor(private readonly http: HttpClient) {}

  notifications: WritableSignal<Notification[] | null> = signal(null);

  getNotifications(): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(this.apiUrl).pipe(
      tap((notifications) => {
        this.notifications.set(NotificationResponse.converter(notifications));
      })
    );
  }

  createNotification(notification: CreateNotificationRequest): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification).pipe(
      tap((newNotification) => {
        this.notifications.update((current) =>
          current ? [newNotification, ...current] : [newNotification]
        );
      })
    );
  }
}
