import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationFacadeService } from '@app/abstraction/notification.facade.service';
import { Notification } from '@app/domain/model/notification';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    BadgeModule,
    ButtonModule,
    DialogModule,
    ScrollPanelModule,
    TooltipModule,
  ],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss',
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  showNotifications = false;
  private readonly subscription = new Subscription();

  constructor(private readonly notificationFacade: NotificationFacadeService) {}

  ngOnInit(): void {
    // Inscrever-se nas notificações
    this.subscription.add(
      this.notificationFacade.getNotifications().subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
        console.log('🔔 Notifications updated:', notifications.length);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackByNotificationId(index: number, notification: Notification): number {
    return notification.id;
  }

  getTimeAgo(timestamp: string): string {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  }
}
