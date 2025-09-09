import { Injectable, ResourceRef } from '@angular/core';
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

  get getProfile(): ResourceRef<User | undefined> {
    return this.authApiService.getProfile;
  }

  updateProfile(user: User): Observable<void> {
    const updateRequest = new UpdateUserRequest(user);

    return this.userApiService.updateUser(user.id, updateRequest).pipe(
      tap(() => {
        this.authApiService.getProfile.reload();
      })
    );
  }
}
