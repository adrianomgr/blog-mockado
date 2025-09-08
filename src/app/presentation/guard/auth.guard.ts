import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/forbidden']);
        return false;
      }
    })
  );
};
