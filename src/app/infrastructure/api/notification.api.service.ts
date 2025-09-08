import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateNotificationRequest } from '../contract/request/create-notification.request';
import { NotificationResponse } from '../contract/response/notification.response';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  private readonly apiUrl = '/api/notifications';

  constructor(private readonly http: HttpClient) {}

  getNotifications(): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(this.apiUrl);
  }

  createNotification(notification: CreateNotificationRequest): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }
}
