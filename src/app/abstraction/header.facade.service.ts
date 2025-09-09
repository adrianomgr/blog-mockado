import { Injectable, ResourceRef } from '@angular/core';
import { User } from '@app/domain/model/user';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderFacadeService {
  constructor(private readonly authApiService: AuthApiService) {}

  // Fazer logout
  logout(): void {
    this.authApiService.logout();
  }

  get getProfile(): ResourceRef<User | undefined> {
    return this.authApiService.getProfile;
  }
}
