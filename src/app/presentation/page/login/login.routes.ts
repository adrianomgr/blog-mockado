import { Routes } from '@angular/router';
import { canDeactivateGuard } from '@app/infrastructure/guard';

export const loginRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./login-view/login-view.component').then((c) => c.LoginViewComponent),
    title: 'Login',
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./sing-up-view/sing-up-view.component').then((c) => c.SingUpViewComponent),
    title: 'Cadastro',
    canDeactivate: [canDeactivateGuard],
  },
];
