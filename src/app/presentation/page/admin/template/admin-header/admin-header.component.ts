import { CommonModule } from '@angular/common';
import { Component, effect, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderFacadeService } from '@app/abstraction/header.facade.service';
import { User } from '@app/domain/model/user';
import { NotificationBellComponent } from '@app/presentation/components/notification-bell/notification-bell.component';
import { UserInitialsPipe } from '@app/presentation/pipe/user-initials.pipe';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  imports: [
    CommonModule,
    ButtonModule,
    ToolbarModule,
    AvatarModule,
    TooltipModule,
    BadgeModule,
    ConfirmDialogModule,
    NotificationBellComponent,
    UserInitialsPipe,
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent implements OnDestroy {
  currentUser: User | null = null;
  notificationCount = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly headerFacade: HeaderFacadeService,
    private readonly confirmationService: ConfirmationService
  ) {
    // Effect para reagir às mudanças do resource getProfile
    effect(() => {
      const profileResource = this.headerFacade.getProfile;

      if (profileResource.hasValue()) {
        const user = profileResource.value();
        if (user) {
          this.currentUser = user;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  get currentUserName(): string {
    return this.currentUser?.name || 'Usuário';
  }

  get currentUserEmail(): string {
    return this.currentUser?.email || '';
  }

  logout(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja fazer logout?',
      header: 'Confirmação de Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, fazer logout',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.headerFacade.logout();
        this.router.navigate(['/login']);
      },
      reject: () => {
        return;
      },
    });
  }
}
