import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/domain/model/user';
import { CreateUserRequest } from '@app/infrastructure/contract/request/create-user.request';
import { UpdateUserRequest } from '@app/infrastructure/contract/request/update-user.request';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserApiService } from '../infrastructure/api/user.api.service';
import { UserResponse } from '../infrastructure/contract/response/user.response';

@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  constructor(private readonly userService: UserApiService) {}

  // Buscar todos os usuários
  getAllUsers(): Observable<User[]> {
    return this.userService.getAllUsers().pipe(
      map(UserResponse.converterLista),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }

  // Buscar usuário por ID
  getUserById(id: number): Observable<User> {
    return this.userService.getUserById(id).pipe(
      map(UserResponse.converter),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }

  // Criar novo usuário
  createUser(user: CreateUserRequest): Observable<User> {
    return this.userService.createUser(user).pipe(
      map(UserResponse.converter),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }

  // Atualizar usuário
  updateUser(id: number, user: UpdateUserRequest): Observable<void> {
    return this.userService
      .updateUser(id, user)
      .pipe(
        catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
      );
  }

  // Deletar usuário
  deleteUser(id: number): Observable<void> {
    return this.userService
      .deleteUser(id)
      .pipe(
        catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
      );
  }
}
