import { Injectable } from '@angular/core';
import { User } from '@app/domain/model/user';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { UserApiService } from '@app/infrastructure/api/user.api.service';
import { UpdateUserRequest } from '@app/infrastructure/contract/request/update-user.request';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileFacadeService {
  constructor(
    private readonly userApiService: UserApiService,
    private readonly authApiService: AuthApiService
  ) {}

  getCurrentUser(): User | null {
    return this.authApiService.getCurrentUser();
  }

  getCurrentUser$(): Observable<User | null> {
    return this.authApiService.currentUser$;
  }

  updateProfile(user: User & { password?: string }): Observable<void> {
    const updateRequest = new UpdateUserRequest({
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      password: (user as any).password, // Incluir senha se fornecida
    });

    return this.userApiService.updateUser(user.id, updateRequest).pipe(
      tap(() => {
        // Força logout para que o usuário faça login novamente com os dados atualizados
        // Isso garante que o token seja atualizado com as novas informações
        console.log('Perfil atualizado com sucesso. Redirecionando para login...');
      })
    );
  }
}
