import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import {
  CreateNotificationRequest,
  Notification,
} from '../../domain/interface/notification.interface';
import { NotificationService } from '../api/notification.service';
import { NotificationStore } from '../store/notification.store';

@Injectable({
  providedIn: 'root',
})
export class NotificationFacadeService {
  constructor(
    private readonly notificationStore: NotificationStore,
    private readonly notificationService: NotificationService
  ) {}

  // Observable das notificações
  get notifications$(): Observable<Notification[]> {
    return this.notificationStore.notifications$;
  }

  // Observable das notificações não lidas
  get unreadNotifications$(): Observable<Notification[]> {
    return this.notificationStore.unreadNotifications$;
  }

  // Observable da contagem de não lidas
  get unreadCount$(): Observable<number> {
    return this.notificationStore.unreadCount$;
  }

  // Notificações recentes
  getRecentNotifications$(limit: number = 10): Observable<Notification[]> {
    return this.notificationStore.getRecentNotifications(limit);
  }

  // Estatísticas das notificações
  getNotificationStatistics$(): Observable<{
    total: number;
    unread: number;
    read: number;
    byType: { [type: string]: number };
  }> {
    return this.notificationStore.getNotificationStatistics();
  }

  // Criar notificação para novo post
  createPostNotification(postTitle: string): Observable<[Notification, Notification]> {
    const notificationData: CreateNotificationRequest = {
      type: 'new-post',
      title: 'Novo Post Criado',
      message: `O post "${postTitle}" foi criado com sucesso`,
    };

    // Adicionar ao store local e fazer chamada HTTP
    const localNotification = this.notificationStore.addNotification(notificationData);
    const httpRequest = this.notificationService.createNotification(notificationData);

    return forkJoin([Promise.resolve(localNotification), httpRequest]);
  }

  // Criar notificação para novo usuário
  createUserNotification(userName: string): Observable<[Notification, Notification]> {
    const notificationData: CreateNotificationRequest = {
      type: 'new-user',
      title: 'Novo Usuário Registrado',
      message: `O usuário "${userName}" foi registrado com sucesso`,
    };

    // Adicionar ao store local e fazer chamada HTTP
    const localNotification = this.notificationStore.addNotification(notificationData);
    const httpRequest = this.notificationService.createNotification(notificationData);

    return forkJoin([Promise.resolve(localNotification), httpRequest]);
  }

  // Marcar como lida
  markAsRead(id: number): Observable<boolean> {
    // Atualizar store local e fazer chamada HTTP
    const localUpdate = this.notificationStore.markAsRead(id);

    if (localUpdate) {
      this.notificationService.markAsRead(id).subscribe({
        next: () => console.log('✅ Notification marked as read on server:', id),
        error: (error) => console.error('❌ Error marking notification as read on server:', error),
      });
    }

    return new Observable((observer) => {
      observer.next(localUpdate);
      observer.complete();
    });
  }

  // Marcar todas como lidas
  markAllAsRead(): Observable<void> {
    this.notificationStore.markAllAsRead();

    this.notificationService.markAllAsRead().subscribe({
      next: () => console.log('✅ All notifications marked as read on server'),
      error: (error) =>
        console.error('❌ Error marking all notifications as read on server:', error),
    });

    return new Observable((observer) => {
      observer.next();
      observer.complete();
    });
  }

  // Remover notificação
  removeNotification(id: number): Observable<boolean> {
    const localRemoval = this.notificationStore.removeNotification(id);

    if (localRemoval) {
      this.notificationService.deleteNotification(id).subscribe({
        next: () => console.log('✅ Notification removed on server:', id),
        error: (error) => console.error('❌ Error removing notification on server:', error),
      });
    }

    return new Observable((observer) => {
      observer.next(localRemoval);
      observer.complete();
    });
  }

  // Limpar todas as notificações
  clearAllNotifications(): Observable<void> {
    this.notificationStore.clearAllNotifications();

    this.notificationService.clearAllNotifications().subscribe({
      next: () => console.log('✅ All notifications cleared on server'),
      error: (error) => console.error('❌ Error clearing all notifications on server:', error),
    });

    return new Observable((observer) => {
      observer.next();
      observer.complete();
    });
  }

  // Limpar notificações lidas
  clearReadNotifications(): Observable<void> {
    this.notificationStore.clearReadNotifications();

    this.notificationService.clearReadNotifications().subscribe({
      next: () => console.log('✅ Read notifications cleared on server'),
      error: (error) => console.error('❌ Error clearing read notifications on server:', error),
    });

    return new Observable((observer) => {
      observer.next();
      observer.complete();
    });
  }

  // Obter notificações por tipo
  getNotificationsByType$(type: 'new-post' | 'new-user'): Observable<Notification[]> {
    return this.notificationStore.getNotificationsByType(type);
  }
}
