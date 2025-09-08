import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginFacadeService } from '@app/abstraction/login.facade.service';
import { User } from '@app/domain/model/user';
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
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login-view',
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
  providers: [MessageService],
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
    private readonly loginFacade: LoginFacadeService
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
    this.loginFacade
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: User[]) => {
          this.testUsers = users;
        },
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

    this.messageService.add({
      severity: 'info',
      summary: 'Credenciais Preenchidas',
      detail: `Credenciais do usuário "${username}" foram preenchidas automaticamente`,
      life: 3000,
    });
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

      this.loginFacade
        .login(username, password)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Login realizado com sucesso!',
            });
            this.router.navigate(['/admin']);
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
