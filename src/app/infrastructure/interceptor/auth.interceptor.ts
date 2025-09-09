import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthApiService);

  // Pega o token do localStorage
  const token = authService.getToken();

  // Se tiver token e não for uma requisição de login, adiciona o Authorization header
  if (token && !req.url.includes('/login')) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    console.log(`[Auth Interceptor] Token: ${authReq.headers.get('Authorization')}`);
    return next(authReq);
  }

  // Se não tiver token ou for login, passa a requisição original
  return next(req);
};
