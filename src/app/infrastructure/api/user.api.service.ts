import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserRequest } from '../contract/request/create-user.request';
import { UpdateUserRequest } from '../contract/request/update-user.request';
import { UserResponse } from '../contract/response/user.response';
import { AuthApiService } from './auth.api.service';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly apiUrl = '/api/users';

  constructor(private readonly http: HttpClient, private readonly authApiService: AuthApiService) {}

  // Buscar todos os usuários
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  // Criar novo usuário
  createUser(user: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, user);
  }

  // Atualizar usuário
  updateUser(id: number, user: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, user);
  }

  // Deletar usuário
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
