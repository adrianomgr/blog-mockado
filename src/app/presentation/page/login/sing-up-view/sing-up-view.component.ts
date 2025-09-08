import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG imports
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

// Services
import { SignUpService } from '@app/infrastructure/api/sign-up.service';

@Component({
  selector: 'app-sing-up-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    FloatLabelModule,
    SelectModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './sing-up-view.component.html',
  styleUrls: ['./sing-up-view.component.scss'],
})
export class SingUpViewComponent {
  signupForm: FormGroup;
  isLoading = false;

  roleOptions = [
    { label: 'Assinante', value: 'subscriber' },
    { label: 'Autor', value: 'author' },
    { label: 'Editor', value: 'editor' },
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly signUpService: SignUpService,
    private readonly messageService: MessageService
  ) {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['subscriber', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid && this.passwordsMatch()) {
      this.isLoading = true;

      const formData = this.signupForm.value;
      const signUpData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      };

      this.signUpService.signUp(signUpData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Conta criada com sucesso! Faça o login.',
            });
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: response.message || 'Erro ao criar conta',
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro no cadastro:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar conta. Tente novamente.',
          });
        },
      });
    } else {
      this.markFormGroupTouched();
      if (!this.passwordsMatch()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'As senhas não coincidem.',
        });
      }
    }
  }

  passwordsMatch(): boolean {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach((key) => {
      this.signupForm.get(key)?.markAsTouched();
    });
  }
}
