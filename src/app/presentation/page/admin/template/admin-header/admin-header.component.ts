import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/domain/interface/user.interface';
import { AuthService } from '@app/infrastructure/api/auth.service';
import { NotificationBellComponent } from '@app/presentation/components/notification-bell.component';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToolbarModule,
    AvatarModule,
    TooltipModule,
    BadgeModule,
    ConfirmDialogModule,
    NotificationBellComponent,
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  notificationCount = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrentUser(): void {
    // Obtém o usuário atual do AuthService
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: User | null) => {
        this.currentUser = user;
        console.log('Header: Usuário carregado:', user);
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuário do header:', error);
      },
    });
  }
  get currentUserName(): string {
    return this.currentUser?.name || 'Usuário';
  }

  get currentUserEmail(): string {
    return this.currentUser?.email || '';
  }

  get currentUserInitials(): string {
    if (!this.currentUser?.name) return 'U';

    const names = this.currentUser.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  toggleMobileMenu(): void {
    // Implementar toggle do menu mobile
    console.log('Toggle mobile menu');
  }

  showNotifications(): void {
    // Implementar exibição de notificações
    console.log('Show notifications');
  }

  logout(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja fazer logout?',
      header: 'Confirmação de Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, fazer logout',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      reject: () => {
        // Usuário cancelou, não faz nada
      },
    });
  }
}
