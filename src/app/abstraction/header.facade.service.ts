import { Injectable } from '@angular/core';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderFacadeService {
  constructor(private readonly authApiService: AuthApiService) {}

  // Fazer logout
  logout(): void {
    this.authApiService.logout();
  }

  // Obter usuário atual (Observable)
  get currentUser$(): Observable<any> {
    return this.authApiService.currentUser$;
  }
}
