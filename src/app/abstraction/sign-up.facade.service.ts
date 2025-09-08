import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/domain/model/user';
import { CreateUserRequest } from '@app/infrastructure/contract/request/create-user.request';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserApiService } from '../infrastructure/api/user.api.service';
import { UserResponse } from '../infrastructure/contract/response/user.response';

@Injectable({
  providedIn: 'root',
})
export class SignUpFacadeService {
  constructor(private readonly userService: UserApiService) {}

  createUser(user: CreateUserRequest): Observable<User> {
    return this.userService.createUser(user).pipe(
      map((response: UserResponse) => UserResponse.converter(response)),
      catchError((erro: HttpErrorResponse) =>
        throwError(() => ErroResponse.converterComToasty(erro))
      )
    );
  }
}
