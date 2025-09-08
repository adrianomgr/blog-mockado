import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { LoginResponse } from '@app/infrastructure/contract/response/login.response';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService {
  constructor(private readonly authApiService: AuthApiService) {}

  // Fazer login
  login(usuario: string, senha: string): Observable<LoginResponse> {
    return this.authApiService
      .login(usuario, senha)
      .pipe(
        catchError((erro: HttpErrorResponse) =>
          throwError(() => ErroResponse.converterComToasty(erro))
        )
      );
  }
}
