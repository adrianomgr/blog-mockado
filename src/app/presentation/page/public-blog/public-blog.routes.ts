import { Routes } from '@angular/router';

export const publicBlogRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public-blog-view/public-blog-view.component').then(
        (c) => c.PublicBlogViewComponent
      ),
    title: 'Blog Público',
  },
];
