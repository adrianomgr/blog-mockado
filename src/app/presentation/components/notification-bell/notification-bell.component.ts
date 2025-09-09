import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { NotificationFacadeService } from '@app/abstraction/notification.facade.service';
import { Notification } from '@app/domain/model/notification';
import { TimeAgoPipe } from '@app/presentation/pipe/time-ago.pipe';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-notification-bell',
  imports: [
    CommonModule,
    BadgeModule,
    ButtonModule,
    DialogModule,
    ScrollPanelModule,
    TooltipModule,
    TimeAgoPipe,
  ],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss',
})
export class NotificationBellComponent implements OnInit {
  notifications: Notification[] = [];
  showNotifications = false;

  constructor(private readonly notificationFacade: NotificationFacadeService) {
    // Effect para observar mudanças no signal de notificações
    effect(() => {
      const notificationsSignal = this.notificationFacade.notifications();
      if (notificationsSignal) {
        this.notifications = notificationsSignal;
      }
    });
  }

  ngOnInit(): void {
    // Carregar notificações iniciais
    this.notificationFacade.getNotifications().subscribe();
  }
}
