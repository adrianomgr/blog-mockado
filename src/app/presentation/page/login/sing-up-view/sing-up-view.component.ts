import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SignUpFacadeService } from '@app/abstraction/sign-up.facade.service';
import { Constants } from '@app/constants';
import { ProfileEnum } from '@app/domain/enum/profile.enum';
import { UserCreate } from '@app/domain/model/user-create';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-sing-up-view',
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
  signupForm: FormGroup<{
    name: FormControl<string>;
    username: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
    role: FormControl<string>;
  }>;
  isLoading = false;

  roleOptions = Object.entries(Constants.descricoesProfile).map(([key, value]) => ({
    value: key as ProfileEnum,
    label: value,
  }));

  constructor(
    private readonly fbr: FormBuilder,
    private readonly router: Router,
    private readonly signUpFacade: SignUpFacadeService,
    private readonly messageService: MessageService
  ) {
    this.signupForm = this.fbr.nonNullable.group({
      name: this.fbr.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      username: this.fbr.nonNullable.control('', [Validators.required, Validators.minLength(4)]),
      email: this.fbr.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fbr.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this.fbr.nonNullable.control('', [Validators.required]),
      role: this.fbr.nonNullable.control('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid && this.passwordsMatch()) {
      this.isLoading = true;

      const { username, password, email, role, name } = this.signupForm.getRawValue();

      const createUser = new UserCreate(username, password, email, role, name);

      this.signUpFacade.createUser(createUser).subscribe(() => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Conta criada com sucesso! Faça o login.',
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 200);
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
    const password = this.signupForm.controls.password.value;
    const confirmPassword = this.signupForm.controls.confirmPassword.value;
    return password === confirmPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach((key) => {
      this.signupForm.get(key)?.markAsTouched();
    });
  }
}
