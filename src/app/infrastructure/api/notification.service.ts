import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateNotificationRequest,
  Notification,
} from '../../domain/interface/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly apiUrl = '/api/notifications';

  constructor(private readonly http: HttpClient) {}

  // Obter todas as notificações
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  // Obter notificação por ID
  getNotificationById(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`);
  }

  // Criar nova notificação
  createNotification(notification: CreateNotificationRequest): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  // Marcar notificação como lida
  markAsRead(id: number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${id}/read`, {});
  }

  // Marcar todas as notificações como lidas
  markAllAsRead(): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/mark-all-read`, {});
  }

  // Deletar notificação
  deleteNotification(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // Limpar todas as notificações
  clearAllNotifications(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/clear-all`);
  }

  // Limpar notificações lidas
  clearReadNotifications(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/clear-read`);
  }

  // Obter notificações não lidas
  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread`);
  }

  // Obter contagem de notificações não lidas
  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`);
  }
}
