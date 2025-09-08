import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notification } from '@app/domain/interface/notification.interface';
import { NotificationFacadeService } from '@app/infrastructure/facade/notification-facade.service';
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
  template: `
    <div class="notification-bell-container">
      <p-button
        icon="pi pi-bell"
        [severity]="notifications.length > 0 ? 'info' : 'secondary'"
        [outlined]="true"
        (onClick)="showNotifications = true"
        [pTooltip]="
          notifications.length > 0 ? notifications.length + ' notificações' : 'Nenhuma notificação'
        "
        tooltipPosition="bottom"
        [badge]="notifications.length > 0 ? notifications.length.toString() : undefined"
        badgeClass="p-badge-info"
      ></p-button>

      <p-dialog
        header="Notificações"
        [(visible)]="showNotifications"
        [modal]="true"
        [style]="{ width: '450px', maxHeight: '600px' }"
        [closable]="true"
        [draggable]="false"
        [resizable]="false"
      >
        <div class="notification-content">
          <div class="notification-list" style="max-height: 400px; overflow-y: auto;">
            <div *ngIf="notifications.length === 0" class="p-4 text-center text-color-secondary">
              <i class="pi pi-bell-slash text-4xl mb-3 block"></i>
              <p>Nenhuma notificação</p>
            </div>

            <div
              *ngFor="let notification of notifications; trackBy: trackByNotificationId"
              class="notification-item p-3 mb-2 border-1 surface-border border-round"
            >
              <div class="flex align-items-start gap-3">
                <i
                  [class]="notification.icon"
                  [class.text-blue-500]="notification.type === 'new-post'"
                  [class.text-green-500]="notification.type === 'new-user'"
                  class="text-xl flex-shrink-0"
                ></i>

                <div class="flex-1">
                  <div class="flex justify-content-between align-items-start">
                    <h5 class="m-0 text-sm font-semibold">{{ notification.title }}</h5>
                    <small class="text-color-secondary">{{
                      getTimeAgo(notification.timestamp)
                    }}</small>
                  </div>
                  <p class="m-0 mt-1 text-sm text-color-secondary">{{ notification.message }}</p>

                  <div class="flex justify-content-between align-items-center mt-2">
                    <span
                      class="text-xs px-2 py-1 border-radius-md"
                      [class.bg-blue-100]="notification.type === 'new-post'"
                      [class.text-blue-700]="notification.type === 'new-post'"
                      [class.bg-green-100]="notification.type === 'new-user'"
                      [class.text-green-700]="notification.type === 'new-user'"
                    >
                      {{ notification.type === 'new-post' ? 'Novo Post' : 'Novo Usuário' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .notification-bell-container {
        position: relative;
      }

      .notification-item {
        transition: background-color 0.2s;
      }

      .notification-unread {
        background-color: var(--blue-50);
        border-left: 3px solid var(--blue-500);
      }

      .notification-item:hover {
        background-color: var(--surface-hover);
      }
    `,
  ],
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  showNotifications = false;
  private readonly subscription = new Subscription();

  constructor(private readonly notificationFacade: NotificationFacadeService) {}

  ngOnInit(): void {
    // Inscrever-se nas notificações
    this.subscription.add(
      this.notificationFacade.getRecentNotifications$(20).subscribe((notifications) => {
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
