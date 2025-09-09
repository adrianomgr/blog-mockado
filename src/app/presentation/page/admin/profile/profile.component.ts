import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileFacadeService } from '@app/abstraction/profile.facade.service';
import { Constants } from '@app/constants';
import { ProfileEnum } from '@app/domain/enum/profile.enum';
import { User } from '@app/domain/model/user';
import { CanComponentDeactivate } from '@app/infrastructure/guard';
import { passwordMatchValidator } from '@app/presentation/validators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, CanComponentDeactivate {
  profileForm!: FormGroup;

  isLoading = false;
  currentUser: User | null = null;
  private formSubmitted = false;

  roleOptions = Object.entries(Constants.descricoesProfile).map(([key, value]) => ({
    value: key as ProfileEnum,
    label: value,
  }));

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly profileFacade: ProfileFacadeService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {
    this.profileForm = this.fb.nonNullable.group(
      {
        name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
        username: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(4)]),
        email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
        role: this.fb.nonNullable.control('', [Validators.required]),
        password: this.fb.nonNullable.control('', [Validators.minLength(6)]),
        confirmPassword: this.fb.nonNullable.control(''),
      },
      { validators: passwordMatchValidator() }
    );
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = this.profileFacade.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        username: this.currentUser.username,
        email: this.currentUser.email,
        role: this.currentUser.role,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não encontrado. Faça login novamente.',
      });
      this.router.navigate(['/login']);
    }
  }

  canDeactivate(): boolean | Promise<boolean> {
    // Se o formulário foi enviado com sucesso, permite sair
    if (this.formSubmitted) {
      return true;
    }

    // Se o formulário não foi alterado, permite sair
    if (this.profileForm.pristine) {
      return true;
    }

    // Se há alterações não salvas, mostra dialog de confirmação
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message: 'Você tem alterações não salvas. Tem certeza de que deseja sair desta página?',
        header: 'Confirmar Saída',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, sair',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        },
      });
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.currentUser) {
      // Verificar se as senhas coincidem quando uma nova senha é fornecida
      if (this.profileForm.value.password && !this.passwordsMatch()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'As senhas não coincidem.',
        });
        return;
      }

      this.isLoading = true;
      const formValues = this.profileForm.getRawValue();

      console.log('📝 [Profile Update] Form values:', formValues);

      const updatedUser: User = {
        ...this.currentUser,
        name: formValues.name,
        username: formValues.username,
        email: formValues.email,
        role: formValues.role as ProfileEnum,
      };

      // Só incluir a senha se ela foi preenchida
      if (formValues.password && formValues.password.trim() !== '') {
        (updatedUser as any).password = formValues.password;
        console.log('🔐 [Profile Update] Password will be updated');
      } else {
        console.log('🔐 [Profile Update] No password change');
      }

      console.log('👤 [Profile Update] User to update:', updatedUser);

      this.profileFacade
        .updateProfile(updatedUser)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => {
            this.formSubmitted = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail:
                'Perfil atualizado com sucesso! Você será redirecionado para fazer login novamente.',
            });

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (error) => {
            console.error('Erro ao atualizar perfil:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao atualizar perfil. Tente novamente.',
            });
          },
        });
    } else {
      this.markFormGroupTouched();
      if (this.profileForm.value.password && !this.passwordsMatch()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'As senhas não coincidem.',
        });
      }
    }
  }

  passwordsMatch(): boolean {
    const password = this.profileForm.get('password')?.value;
    const confirmPassword = this.profileForm.get('confirmPassword')?.value;

    // Se não há senha preenchida, considera como válido
    if (!password || password.trim() === '') {
      return true;
    }

    return password === confirmPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      this.profileForm.get(key)?.markAsTouched();
    });
  }
}
