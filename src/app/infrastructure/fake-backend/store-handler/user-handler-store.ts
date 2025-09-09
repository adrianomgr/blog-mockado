import { Injectable } from '@angular/core';
import { User } from '@app/domain/model/user';
import { UsersMock } from '@app/infrastructure/mock/users.mock';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserHandlerStore {
  private readonly usersSubject = new BehaviorSubject<User[]>(UsersMock);

  private readonly users$ = this.usersSubject.asObservable();

  constructor() {}

  get currentUsers(): User[] {
    const users = this.usersSubject.value;
    return users;
  }

  // Método para adicionar um novo usuário
  addUser(user: User): void {
    const currentUsers = this.currentUsers;
    this.usersSubject.next([...currentUsers, user]);
  }

  // Método para atualizar um usuário existente
  updateUser(updatedUser: User): void {
    const currentUsers = this.currentUsers;
    const userIndex = currentUsers.findIndex((u) => u.id === updatedUser.id);

    if (userIndex !== -1) {
      const updatedUsers = [...currentUsers];
      updatedUsers[userIndex] = updatedUser;
      this.usersSubject.next(updatedUsers);
    }
  }

  // Método para remover um usuário
  removeUser(userId: number): void {
    const currentUsers = this.currentUsers;
    const filteredUsers = currentUsers.filter((u) => u.id !== userId);
    this.usersSubject.next(filteredUsers);
  }

  // Método para buscar usuário por ID
  getUserById(id: number): User | undefined {
    return this.currentUsers.find((u) => u.id === id);
  }
}
