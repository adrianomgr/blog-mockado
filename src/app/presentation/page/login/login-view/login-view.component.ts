import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG imports
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

// Services
import { UserFacade } from '@app/abstraction/user.facade';
import { User } from '@app/domain/interface/user.interface';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { UserStore } from '@app/infrastructure/store/user.store';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ToastModule,
    FloatLabelModule,
    TableModule,
    TagModule,
    DialogModule,
  ],
  providers: [MessageService, UserFacade],
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss'],
})
export class LoginViewComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  testUsers: User[] = [];
  showTestCredentials = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly authService: AuthApiService,
    private readonly userFacade: UserFacade,
    private readonly userStore: UserStore
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loadTestUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTestUsers(): void {
    // Se inscrever nos usuários do UserStore para receber atualizações em tempo real
    this.userStore.users$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
      this.testUsers = users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role as any,
        name: user.name,
      }));
      console.log('🔄 Lista de usuários atualizada no login:', this.testUsers.length);
    });
  }

  toggleTestCredentials(): void {
    this.showTestCredentials = !this.showTestCredentials;
  }

  useTestCredentials(username: string, password: string): void {
    this.loginForm.patchValue({
      username: username,
      password: password,
    });
    this.showTestCredentials = false; // Fechar o dialog

    // Feedback visual para o usuário
    this.messageService.add({
      severity: 'info',
      summary: 'Credenciais Preenchidas',
      detail: `Credenciais do usuário "${username}" foram preenchidas automaticamente`,
      life: 3000,
    });
  }

  getTestPassword(username: string): string {
    // Para usuários padrão, usar senhas conhecidas
    const defaultPasswordMap: { [key: string]: string } = {
      admin: 'admin123',
      editor: 'editor123',
      user: 'user123',
    };

    // Se é um usuário padrão, retornar a senha conhecida
    if (defaultPasswordMap[username]) {
      return defaultPasswordMap[username];
    }

    // Para usuários criados via sign-up, buscar no UserStore
    const user = this.userStore.getUserByUsername(username);
    if (user) {
      return user.password; // Retornar a senha real (só para teste)
    }

    return '******'; // Senha oculta para segurança
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      admin: 'Administrador',
      editor: 'Editor',
      author: 'Autor',
      subscriber: 'Assinante',
    };
    return roleMap[role] || role;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;

      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Login realizado com sucesso!',
            });

            // Redirecionar baseado no role do usuário
            const user = response.user;
            if (user?.role === 'admin' || user?.role === 'editor') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/blog']);
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: response.message || 'Erro ao fazer login',
            });
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro no login:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Credenciais inválidas ou erro no servidor',
          });
        },
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}
