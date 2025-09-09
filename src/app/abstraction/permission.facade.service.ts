import { Injectable, computed, inject } from '@angular/core';
import { ProfileEnum } from '@app/domain/enum/profile.enum';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionFacadeService {
  private readonly authApiService = inject(AuthApiService);

  currentUser = computed(() => this.authApiService.getProfile.value());

  isAdmin = computed(() => this.currentUser()?.role === ProfileEnum.ADMIN);
  isEditor = computed(() => this.currentUser()?.role === ProfileEnum.EDITOR);
  isAuthor = computed(() => this.currentUser()?.role === ProfileEnum.AUTHOR);

  canManageUsers(): boolean {
    return this.isAdmin();
  }

  canEditUser(targetUserId: number): boolean {
    const currentUser = this.currentUser();
    if (!currentUser) return false;
    if (currentUser.role === ProfileEnum.ADMIN) return true;
    return currentUser.id === targetUserId;
  }

  canDeleteUser(targetUserId: number): boolean {
    const currentUser = this.currentUser();
    if (!currentUser) return false;
    if (currentUser.role !== ProfileEnum.ADMIN) return false;
    return currentUser.id !== targetUserId;
  }

  canCreateUser(): boolean {
    return this.isAdmin();
  }

  canEditPost(postAuthorId?: number): boolean {
    const currentUser = this.currentUser();
    if (!currentUser) return false;
    if (currentUser.role === ProfileEnum.ADMIN) return true;
    if (currentUser.role === ProfileEnum.EDITOR) return true;
    if (currentUser.role === ProfileEnum.AUTHOR && postAuthorId !== undefined) {
      return currentUser.id === postAuthorId;
    }
    return false;
  }

  canCreatePost(): boolean {
    return !!this.currentUser();
  }

  canAccessAdminPanel(): boolean {
    const currentUser = this.currentUser();
    if (!currentUser) return false;
    return [ProfileEnum.ADMIN, ProfileEnum.EDITOR, ProfileEnum.AUTHOR].includes(currentUser.role);
  }

  getPermissionsSummary(): string[] {
    const currentUser = this.currentUser();
    if (!currentUser) return [];
    const permissions: string[] = [];
    switch (currentUser.role) {
      case ProfileEnum.ADMIN:
        permissions.push(
          'Gerenciar todos os usuários',
          'Editar/deletar qualquer post',
          'Acessar todas as estatísticas',
          'Controle total do sistema'
        );
        break;
      case ProfileEnum.EDITOR:
        permissions.push(
          'Editar qualquer post',
          'Deletar qualquer post',
          'Editar apenas seus dados pessoais',
          'Ver estatísticas limitadas'
        );
        break;
      case ProfileEnum.AUTHOR:
        permissions.push(
          'Editar apenas seus posts',
          'Deletar apenas seus posts',
          'Editar apenas seus dados pessoais',
          'Ver estatísticas limitadas'
        );
        break;
    }
    return permissions;
  }
}
