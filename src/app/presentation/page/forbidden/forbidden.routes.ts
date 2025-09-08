import { Routes } from '@angular/router';
import { ForbiddenViewComponent } from './forbidden-view.component';

export const forbiddenRoutes: Routes = [
  {
    path: '',
    component: ForbiddenViewComponent,
  },
];
