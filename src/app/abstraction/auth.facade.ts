import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../infrastructure/api/auth.service';
import { Login } from '../domain/model/login';
import { LoginResponse } from '../infrastructure/contract/response/login.response';

@Injectable({
  providedIn: 'root'
})
export class LoginFacade {
  
  constructor(private readonly authService: AuthService) {}

  login(usuario: string, senha: string): Observable<Login> {
    return this.authService.login(usuario, senha)
      .pipe(map(LoginResponse.converter));
  }
}
