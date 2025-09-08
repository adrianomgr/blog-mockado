import { Injectable } from '@angular/core';
import { User } from '@app/domain/model/user';
import { UsersMock } from '@app/infrastructure/mock/users.mock';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private readonly usersSubject = new BehaviorSubject<User[]>(UsersMock);

  private readonly users$ = this.usersSubject.asObservable();

  constructor() {
    console.log('🏪 UserStore inicializando...');
    console.log('📦 UsersMock importado:', UsersMock);
    console.log('📦 Tipo do UsersMock:', typeof UsersMock);
    console.log('📦 É array?', Array.isArray(UsersMock));
    console.log('👥 Usuários no BehaviorSubject:', this.usersSubject.value);
    console.log('📊 Total de usuários:', this.usersSubject.value?.length || 0);
  }

  get currentUsers(): User[] {
    const users = this.usersSubject.value;
    console.log('🔍 getCurrentUsers chamado, retornando:', users);
    return users;
  }

  // Método para adicionar um novo usuário
  addUser(user: User): void {
    const currentUsers = this.currentUsers;
    this.usersSubject.next([...currentUsers, user]);
    console.log('UserStore:', user.username);
  }

  // Método para atualizar um usuário existente
  updateUser(updatedUser: User): void {
    const currentUsers = this.currentUsers;
    const userIndex = currentUsers.findIndex((u) => u.id === updatedUser.id);

    if (userIndex !== -1) {
      const updatedUsers = [...currentUsers];
      updatedUsers[userIndex] = updatedUser;
      this.usersSubject.next(updatedUsers);
      console.log('UserStore:', updatedUser.username);
    }
  }

  // Método para remover um usuário
  removeUser(userId: number): void {
    const currentUsers = this.currentUsers;
    const filteredUsers = currentUsers.filter((u) => u.id !== userId);
    this.usersSubject.next(filteredUsers);
    console.log('UserStore:', userId);
  }

  // Método para buscar usuário por ID
  getUserById(id: number): User | undefined {
    return this.currentUsers.find((u) => u.id === id);
  }
}
