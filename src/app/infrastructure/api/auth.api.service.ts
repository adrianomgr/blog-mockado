import { HttpClient } from '@angular/common/http';
import { Injectable, resource, ResourceRef, signal, WritableSignal } from '@angular/core';
import { User } from '@app/domain/model/user';
import { LoginRequest } from '@app/infrastructure/contract/request/login.request';
import { LoginResponse } from '@app/infrastructure/contract/response/login.response';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, firstValueFrom, map, Observable, tap } from 'rxjs';
import { UserResponse } from '../contract/response/user.response';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public idcurrentUser: WritableSignal<number | undefined> = signal(undefined);
  public currentUser$ = this.currentUserSubject.asObservable();

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly TOKEN_KEY = 'jwt_token';

  constructor(private readonly http: HttpClient, private readonly jwtHelper: JwtHelperService) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this.logout();
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken: User = this.jwtHelper.decodeToken(token)!;
      this.currentUserSubject.next(decodedToken);
      this.isAuthenticatedSubject.next(true);
    }
  }

  getProfile: ResourceRef<User | undefined> = resource({
    params: () => ({ id: this.idcurrentUser() }),
    loader: async ({ params }) => {
      if (params.id) {
        return await firstValueFrom(this.getUserById(params.id).pipe(map(UserResponse.converter)));
      }

      return undefined;
    },
  });

  // Buscar usuário por ID
  getUserById(id: number): Observable<UserResponse> {
    const apiUrl = '/api/users';
    return this.http.get<UserResponse>(`${apiUrl}/${id}`);
  }

  login(usuario: string, senha: string): Observable<LoginResponse> {
    const body = new LoginRequest(usuario, senha);
    return this.http.post<LoginResponse>('/api/login', body).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          this.setToken(response.token);
          this.idcurrentUser.set(response.user.id);
          this.currentUserSubject.next(LoginResponse.converter(response).user!);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.idcurrentUser.set(undefined);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }
}
