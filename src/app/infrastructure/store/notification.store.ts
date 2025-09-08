import { Injectable } from '@angular/core';
import { Constants } from '@app/constants';
import { NotificationSeverityEnum } from '@app/domain/enum/notification-severity.enum';
import { NotificationTypeEnum } from '@app/domain/enum/notification-type.enum';
import { Notification } from '@app/domain/model/notification';
import * as NotificationsMock from '@app/infrastructure/mock/notifications.mock.json';
import { BehaviorSubject, Observable, map } from 'rxjs';

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

    console.log(
      '🔔 Notification added:',
      newNotification.title,
      '| Total notifications:',
      updatedNotifications.length
    );
    return newNotification;
  }

  // Método para marcar uma notificação como lida
  markAsRead(id: number): boolean {
    const currentNotifications = this.currentNotifications;
    const notificationIndex = currentNotifications.findIndex((n) => n.id === id);

    if (notificationIndex === -1) {
      console.log('❌ Notification not found for read:', id);
      return false;
    }

    const updatedNotifications = [...currentNotifications];
    updatedNotifications[notificationIndex] = {
      ...updatedNotifications[notificationIndex],
      read: true,
    };

    this.notificationsSubject.next(updatedNotifications);

    console.log('👁️ Notification marked as read:', id);
    return true;
  }

  // Método para marcar todas as notificações como lidas
  markAllAsRead(): void {
    const currentNotifications = this.currentNotifications;
    const updatedNotifications = currentNotifications.map((n) => ({ ...n, read: true }));

    this.notificationsSubject.next(updatedNotifications);

    console.log('👁️ All notifications marked as read');
  }

  // Método para remover uma notificação
  removeNotification(id: number): boolean {
    const currentNotifications = this.currentNotifications;
    const notificationIndex = currentNotifications.findIndex((n) => n.id === id);

    if (notificationIndex === -1) {
      console.log('❌ Notification not found for removal:', id);
      return false;
    }

    const removedNotification = currentNotifications[notificationIndex];
    const updatedNotifications = currentNotifications.filter((n) => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);

    console.log(
      '🗑️ Notification removed:',
      removedNotification.title,
      '| Remaining notifications:',
      updatedNotifications.length
    );
    return true;
  }

  // Método para limpar todas as notificações
  clearAllNotifications(): void {
    this.notificationsSubject.next([]);
    console.log('🧹 All notifications cleared');
  }

  // Método para limpar apenas notificações lidas
  clearReadNotifications(): void {
    const currentNotifications = this.currentNotifications;
    const unreadNotifications = currentNotifications.filter((n) => !n.read);

    this.notificationsSubject.next(unreadNotifications);

    console.log('🧹 Read notifications cleared. Remaining:', unreadNotifications.length);
  }

  // Método para obter notificações por tipo
  getNotificationsByType(type: NotificationTypeEnum): Observable<Notification[]> {
    return this.notifications$.pipe(
      map((notifications) => notifications.filter((n) => n.type === type))
    );
  }

  // Método para obter notificações recentes (últimas N notificações)
  getRecentNotifications(limit: number = 10): Observable<Notification[]> {
    return this.notifications$.pipe(
      map((notifications) => {
        const sortedNotifications = [...notifications].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        return sortedNotifications.slice(0, limit);
      })
    );
  }

  // Método para obter estatísticas das notificações
  getNotificationStatistics(): Observable<{
    total: number;
    unread: number;
    read: number;
    byType: { [type: string]: number };
  }> {
    return this.notifications$.pipe(
      map((notifications) => {
        const byType: { [type: string]: number } = {};

        notifications.forEach((notification) => {
          byType[notification.type] = (byType[notification.type] || 0) + 1;
        });

        return {
          total: notifications.length,
          unread: notifications.filter((n) => !n.read).length,
          read: notifications.filter((n) => n.read).length,
          byType,
        };
      })
    );
  }

  // Método privado para definir as notificações iniciais
  private getInitialNotifications(): Notification[] {
    return [
      // Notificações dos usuários iniciais
      {
        id: 1,
        type: NotificationTypeEnum.NEW_USER,
        title: 'Novo Usuário Registrado',
        message: 'O usuário "Administrador do Sistema" foi registrado com sucesso',
        timestamp: '2024-01-01T09:00:00Z',
        read: true,
        icon: 'pi pi-user-plus',
        severity: NotificationSeverityEnum.SUCCESS,
      },
      {
        id: 2,
        type: NotificationTypeEnum.NEW_USER,
        title: 'Novo Usuário Registrado',
        message: 'O usuário "Editor de Conteúdo" foi registrado com sucesso',
        timestamp: '2024-01-02T10:15:00Z',
        read: true,
        icon: 'pi pi-user-plus',
        severity: NotificationSeverityEnum.SUCCESS,
      },
      {
        id: 3,
        type: NotificationTypeEnum.NEW_USER,
        title: 'Novo Usuário Registrado',
        message: 'O usuário "Usuário Padrão" foi registrado com sucesso',
        timestamp: '2024-01-03T14:30:00Z',
        read: false,
        icon: 'pi pi-user-plus',
        severity: NotificationSeverityEnum.SUCCESS,
      },
      // Notificações dos posts iniciais
      {
        id: 4,
        type: NotificationTypeEnum.NEW_POST,
        title: 'Novo Post Criado',
        message: 'O post "Gerenciamento de Estado com NgRx" foi criado com sucesso',
        timestamp: '2024-01-05T11:20:00Z',
        read: true,
        icon: 'pi pi-file-edit',
        severity: NotificationSeverityEnum.INFO,
      },
      {
        id: 5,
        type: NotificationTypeEnum.NEW_POST,
        title: 'Novo Post Criado',
        message: 'O post "PrimeNG: Componentes Poderosos" foi criado com sucesso',
        timestamp: '2024-01-08T16:45:00Z',
        read: false,
        icon: 'pi pi-file-edit',
        severity: NotificationSeverityEnum.INFO,
      },
      {
        id: 6,
        type: NotificationTypeEnum.NEW_POST,
        title: 'Novo Post Criado',
        message: 'O post "TypeScript para Iniciantes" foi criado com sucesso',
        timestamp: '2024-01-10T14:30:00Z',
        read: false,
        icon: 'pi pi-file-edit',
        severity: NotificationSeverityEnum.INFO,
      },
      {
        id: 7,
        type: NotificationTypeEnum.NEW_POST,
        title: 'Novo Post Criado',
        message: 'O post "Introdução ao Angular 18" foi criado com sucesso',
        timestamp: '2024-01-15T10:00:00Z',
        read: false,
        icon: 'pi pi-file-edit',
        severity: NotificationSeverityEnum.INFO,
      },
    ];
  }
}
