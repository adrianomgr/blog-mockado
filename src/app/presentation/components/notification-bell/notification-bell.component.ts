import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationFacadeService } from '@app/abstraction/notification.facade.service';
import { Notification } from '@app/domain/model/notification';
import { TimeAgoPipe } from '@app/presentation/pipe/time-ago.pipe';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

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
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
