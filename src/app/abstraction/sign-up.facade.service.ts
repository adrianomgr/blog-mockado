import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationTypeEnum } from '@app/domain/enum/notification-type.enum';
import { NovoNotification } from '@app/domain/model/novo-notification';
import { User } from '@app/domain/model/user';
import { UserCreate } from '@app/domain/model/user-create';
import { NotificationApiService } from '@app/infrastructure/api/notification.api.service';
import { CreateNotificationRequest } from '@app/infrastructure/contract/request/create-notification.request';
import { CreateUserRequest } from '@app/infrastructure/contract/request/create-user.request';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserApiService } from '../infrastructure/api/user.api.service';
import { UserResponse } from '../infrastructure/contract/response/user.response';

@Injectable({
  providedIn: 'root',
})
export class SignUpFacadeService {
  constructor(
    private readonly userService: UserApiService,
    private readonly notificationApiService: NotificationApiService
  ) {}

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
}
