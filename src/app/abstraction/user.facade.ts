import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CreateUserRequest, UpdateUserRequest, User } from '../domain/interface/user.interface';
import { UserService } from '../infrastructure/api/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  constructor(private readonly userService: UserService) {}

  // Buscar todos os usuários
  getAllUsers(): Observable<User[]> {
    return this.userService.getAllUsers().pipe(
      catchError((error) => {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      })
    );
  }

  // Buscar usuário por ID
  getUserById(id: number): Observable<User> {
    return this.userService.getUserById(id).pipe(
      catchError((error) => {
        console.error('Erro ao buscar usuário por ID:', error);
        throw error;
      })
    );
  }

  // Criar novo usuário
  createUser(user: CreateUserRequest): Observable<User> {
    return this.userService.createUser(user).pipe(
      map((response) => {
        console.log('Usuário criado com sucesso:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Erro ao criar usuário:', error);
        throw error;
      })
    );
  }

  // Atualizar usuário
  updateUser(id: number, user: UpdateUserRequest): Observable<User> {
    return this.userService.updateUser(id, user).pipe(
      map((response) => {
        console.log('Usuário atualizado com sucesso:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
      })
    );
  }

  // Deletar usuário
  deleteUser(id: number): Observable<any> {
    return this.userService.deleteUser(id).pipe(
      map(() => {
        console.log('Usuário deletado com sucesso');
        return true;
      }),
      catchError((error) => {
        console.error('Erro ao deletar usuário:', error);
        throw error;
      })
    );
  }

  // Buscar usuários por role
  getUsersByRole(role: string): Observable<User[]> {
    return this.userService.getUsersByRole(role).pipe(
      catchError((error) => {
        console.error('Erro ao buscar usuários por role:', error);
        throw error;
      })
    );
  }

  // Contar usuários
  getUsersCount(): Observable<number> {
    return this.getAllUsers().pipe(map((users) => users.length));
  }

  // Contar administradores
  getAdminsCount(): Observable<number> {
    return this.getUsersByRole('admin').pipe(map((users) => users.length));
  }
}
