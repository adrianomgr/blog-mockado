import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador customizado para verificar se dois campos de senha coincidem
 * @param passwordField Nome do campo de senha (padrão: 'password')
 * @param confirmPasswordField Nome do campo de confirmação de senha (padrão: 'confirmPassword')
 * @returns ValidatorFn que retorna erro 'passwordMismatch' se as senhas não coincidirem
 */
export function passwordMatchValidator(
  passwordField: string = 'password',
  confirmPasswordField: string = 'confirmPassword'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordField);
    const confirmPassword = control.get(confirmPasswordField);

    // Se um dos campos não existir, não aplicar validação
    if (!password || !confirmPassword) {
      return null;
    }

    // Se os campos estão vazios, não aplicar validação (deixar para outros validadores)
    if (!password.value || !confirmPassword.value) {
      return null;
    }

    // Verificar se as senhas coincidem
    const isMatching = password.value === confirmPassword.value;

    // Se não coincidem, marcar erro no campo de confirmação
    if (!isMatching) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Se coincidem, remover erro de mismatch (preservar outros erros)
    if (confirmPassword.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      const hasOtherErrors = Object.keys(errors).length > 0;
      confirmPassword.setErrors(hasOtherErrors ? errors : null);
    }

    return null;
  };
}
