import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '@app/domain/model/notification';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { NotificationResponse } from '@app/infrastructure/contract/response/notification.response';
import { catchError, map, Observable, throwError } from 'rxjs';
import { NotificationService } from '../infrastructure/api/notification.api.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationFacadeService {
  constructor(private readonly notificationService: NotificationService) {}

  getNotifications(): Observable<Notification[]> {
    return this.notificationService.getNotifications().pipe(
      map(NotificationResponse.converter),
      catchError((erro: HttpErrorResponse) =>
        throwError(() => ErroResponse.converterComToasty(erro))
      )
    );
  }
}
