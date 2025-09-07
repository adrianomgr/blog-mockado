import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/blog',
        pathMatch: 'full',
    },
    {
        path: 'blog',
        loadChildren: () =>
            import('./presentation/page/public-blog/public-blog.routes').then((m) => m.publicBlogRoutes),
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./presentation/page/login/login.routes').then((m) => m.loginRoutes),
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./presentation/page/admin/admin.routes').then((m) => m.adminRoutes),
    },
    {
        path: '**',
        redirectTo: '/blog',
    },
];
