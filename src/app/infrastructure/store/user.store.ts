import { Injectable } from '@angular/core';
import { User } from '@app/domain/model/user';
import * as UsersMock from '@app/infrastructure/mock/users.mock.json';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private readonly usersSubject = new BehaviorSubject<User[]>(UsersMock as User[]);

  private readonly users$ = this.usersSubject.asObservable();

  get currentUsers(): User[] {
    return this.usersSubject.value;
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
