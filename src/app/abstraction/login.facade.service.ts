import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/domain/model/user';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { UserApiService } from '@app/infrastructure/api/user.api.service';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { LoginResponse } from '@app/infrastructure/contract/response/login.response';
import { UserResponse } from '@app/infrastructure/contract/response/user.response';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService {
  constructor(
    private readonly authApiService: AuthApiService,
    private readonly userApiService: UserApiService,
    private readonly messageService: MessageService
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.authApiService.login(username, password).pipe(
      catchError((erro: HttpErrorResponse) => {
        return throwError(() => ErroResponse.converter(erro)); // Retorna o erro
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.userApiService.getAllUsers().pipe(
      map(UserResponse.converterLista),
      catchError((erro: HttpErrorResponse) => {
        console.error('Erro ao buscar usuários:', erro);
        return throwError(() => ErroResponse.converter(erro));
      })
    );
  }
}
