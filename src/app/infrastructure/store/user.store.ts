import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserCreate } from '../../domain/model/user-create';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  // BehaviorSubject para gerenciar usuários de forma reativa
  private readonly usersSubject = new BehaviorSubject<UserCreate[]>([]);

  // Observable público para outros serviços
  public readonly users$ = this.usersSubject.asObservable();

  // Getter para obter a lista atual de usuários
  get currentUsers(): UserCreate[] {
    return this.usersSubject.value;
  }

  // Método para inicializar usuários (usado pelo InMemoryDataService)
  initializeUsers(users: UserCreate[]): void {
    this.usersSubject.next(users);
    console.log('🔧 UserStore initialized with users:', users.length);
  }

  // Método para adicionar um novo usuário
  addUser(user: UserCreate): void {
    const currentUsers = this.currentUsers;
    this.usersSubject.next([...currentUsers, user]);
    console.log('➕ User added to UserStore:', user.username);
  }

  // Método para atualizar um usuário existente
  updateUser(updatedUser: UserCreate): void {
    const currentUsers = this.currentUsers;
    const userIndex = currentUsers.findIndex((u) => u.id === updatedUser.id);

    if (userIndex !== -1) {
      const updatedUsers = [...currentUsers];
      updatedUsers[userIndex] = updatedUser;
      this.usersSubject.next(updatedUsers);
      console.log('🔄 User updated in UserStore:', updatedUser.username);
    }
  }

  // Método para remover um usuário
  removeUser(userId: number): void {
    const currentUsers = this.currentUsers;
    const filteredUsers = currentUsers.filter((u) => u.id !== userId);
    this.usersSubject.next(filteredUsers);
    console.log('🗑️ User removed from UserStore, ID:', userId);
  }

  // Método para buscar usuário por ID
  getUserById(id: number): UserCreate | undefined {
    return this.currentUsers.find((u) => u.id === id);
  }

  // Método para buscar usuário por username
  getUserByUsername(username: string): UserCreate | undefined {
    return this.currentUsers.find((u) => u.username === username);
  }

  // Método para buscar usuário por email
  getUserByEmail(email: string): UserCreate | undefined {
    return this.currentUsers.find((u) => u.email === email);
  }

  // Método para verificar se username existe
  usernameExists(username: string, excludeId?: number): boolean {
    return this.currentUsers.some((u) => u.username === username && u.id !== excludeId);
  }

  // Método para verificar se email existe
  emailExists(email: string, excludeId?: number): boolean {
    return this.currentUsers.some((u) => u.email === email && u.id !== excludeId);
  }

  // Método para obter próximo ID disponível
  getNextId(): number {
    const currentUsers = this.currentUsers;
    return currentUsers.length > 0 ? Math.max(...currentUsers.map((u) => u.id)) + 1 : 1;
  }

  // Método para filtrar usuários por role
  getUsersByRole(role: string): UserCreate[] {
    return this.currentUsers.filter((u) => u.role === role);
  }

  // Método para obter contagem total de usuários
  getUserCount(): number {
    return this.currentUsers.length;
  }

  // Método para limpar todos os usuários (útil para testes)
  clearUsers(): void {
    this.usersSubject.next([]);
    console.log('🧹 UserStore cleared');
  }
}
