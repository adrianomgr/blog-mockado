import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG imports
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

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
    ],
    providers: [MessageService],
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.scss'],
})
export class LoginViewComponent {
    loginForm: FormGroup;
    loading = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly messageService: MessageService,
    ) {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.loading = true;

            // Simulação de login
            setTimeout(() => {
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Login realizado com sucesso!',
                });
                this.router.navigate(['/dashboard']);
            }, 2000);
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
