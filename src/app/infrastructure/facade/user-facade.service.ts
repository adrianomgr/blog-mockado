import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserCreate } from '../../domain/model/user-create';
import { UserStore } from '../store/user.store';

/**
 * Facade para operações de usuários
 * Demonstra como usar o UserStore com BehaviorSubject de forma reativa
 */
@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  constructor(private readonly userStore: UserStore) {}

  // Observable que emite sempre que a lista de usuários muda
  get users$(): Observable<UserCreate[]> {
    return this.userStore.users$;
  }

  // Observable que emite o total de usuários
  get userCount$(): Observable<number> {
    return this.userStore.users$.pipe(map((users) => users.length));
  }

  // Observable que emite usuários por role
  getUsersByRole$(role: string): Observable<UserCreate[]> {
    return this.userStore.users$.pipe(map((users) => users.filter((user) => user.role === role)));
  }

  // Observable que emite contagem de usuários por role
  getUserCountByRole$(role: string): Observable<number> {
    return this.getUsersByRole$(role).pipe(map((users) => users.length));
  }

  // Observable que emite usuários administradores
  get admins$(): Observable<UserCreate[]> {
    return this.getUsersByRole$('admin');
  }

  // Observable que emite usuários editores
  get editors$(): Observable<UserCreate[]> {
    return this.getUsersByRole$('editor');
  }

  // Observable que emite usuários assinantes
  get subscribers$(): Observable<UserCreate[]> {
    return this.getUsersByRole$('subscriber');
  }

  // Métodos síncronos para operações diretas
  getUserById(id: number): UserCreate | undefined {
    return this.userStore.getUserById(id);
  }

  getUserByUsername(username: string): UserCreate | undefined {
    return this.userStore.getUserByUsername(username);
  }

  getUserByEmail(email: string): UserCreate | undefined {
    return this.userStore.getUserByEmail(email);
  }

  // Verificações de existência
  isUsernameAvailable(username: string, excludeId?: number): boolean {
    return !this.userStore.usernameExists(username, excludeId);
  }

  isEmailAvailable(email: string, excludeId?: number): boolean {
    return !this.userStore.emailExists(email, excludeId);
  }

  // Métodos para manipulação de dados
  createUser(userData: Omit<UserCreate, 'id'>): UserCreate {
    const newUser: UserCreate = {
      ...userData,
      id: this.userStore.getNextId(),
    };

    this.userStore.addUser(newUser);
    return newUser;
  }

  updateUser(userId: number, updates: Partial<UserCreate>): boolean {
    const existingUser = this.userStore.getUserById(userId);
    if (!existingUser) {
      return false;
    }

    const updatedUser: UserCreate = {
      ...existingUser,
      ...updates,
      id: userId, // Garantir que o ID não mude
    };

    this.userStore.updateUser(updatedUser);
    return true;
  }

  deleteUser(userId: number): boolean {
    const user = this.userStore.getUserById(userId);
    if (!user) {
      return false;
    }

    this.userStore.removeUser(userId);
    return true;
  }

  // Métodos utilitários
  getTotalUsers(): number {
    return this.userStore.getUserCount();
  }

  getUserStatistics(): Observable<{
    total: number;
    admins: number;
    editors: number;
    authors: number;
    subscribers: number;
  }> {
    return this.userStore.users$.pipe(
      map((users) => ({
        total: users.length,
        admins: users.filter((u) => u.role === 'admin').length,
        editors: users.filter((u) => u.role === 'editor').length,
        authors: users.filter((u) => u.role === 'author').length,
        subscribers: users.filter((u) => u.role === 'subscriber').length,
      }))
    );
  }

  // Busca de usuários
  searchUsers(searchTerm: string): Observable<UserCreate[]> {
    return this.userStore.users$.pipe(
      map((users) =>
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }
}
