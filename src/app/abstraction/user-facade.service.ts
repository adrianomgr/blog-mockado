import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationTypeEnum } from '@app/domain/enum/notification-type.enum';
import { NovoNotification } from '@app/domain/model/novo-notification';
import { User } from '@app/domain/model/user';
import { UserCreate } from '@app/domain/model/user-create';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { NotificationApiService } from '@app/infrastructure/api/notification.api.service';
import { CreateNotificationRequest } from '@app/infrastructure/contract/request/create-notification.request';
import { CreateUserRequest } from '@app/infrastructure/contract/request/create-user.request';
import { UpdateUserRequest } from '@app/infrastructure/contract/request/update-user.request';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { UserApiService } from '../infrastructure/api/user.api.service';
import { UserResponse } from '../infrastructure/contract/response/user.response';

@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  constructor(
    private readonly userService: UserApiService,
    private readonly notificationApiService: NotificationApiService,
    private readonly authApiService: AuthApiService
  ) {}

  // Buscar todos os usuários
  getAllUsers(): Observable<User[]> {
    return this.userService.getAllUsers().pipe(
      map(UserResponse.converterLista),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }

  // Criar novo usuário
  createUser(user: UserCreate): Observable<User> {
    const createUserRequest = new CreateUserRequest(user);

    return this.userService.createUser(createUserRequest).pipe(
      map((response: UserResponse) => UserResponse.converter(response)),
      mergeMap((createdUser: User) => {
        // Criar notificação usando o novo modelo
        const notification = new NovoNotification(NotificationTypeEnum.NEW_USER, user);
        const notificationRequest = new CreateNotificationRequest(notification.toCreateRequest());

        return this.notificationApiService
          .createNotification(notificationRequest)
          .pipe(map(() => createdUser));
      }),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }

  // Atualizar usuário
  updateUser(id: number, user: UpdateUserRequest): Observable<void> {
    return this.userService.updateUser(id, user).pipe(
      tap(() => {
        if (user.id === this.authApiService.idcurrentUser()) {
          this.authApiService.getProfile.reload();
        }
      }),
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
