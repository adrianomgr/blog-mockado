import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [PanelMenuModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/admin/dashboard'],
    },
    {
      label: 'Conteúdo',
      icon: 'pi pi-file-edit',
      expanded: true,
      items: [
        {
          label: 'Posts',
          icon: 'pi pi-file-edit',
          routerLink: ['/admin/posts'],
        },
        {
          label: 'Categorias',
          icon: 'pi pi-tags',
          routerLink: ['/admin/categories'],
        },
      ],
    },
    {
      label: 'Usuários',
      icon: 'pi pi-users',
      routerLink: ['/admin/users'],
    },
    {
      label: 'Configurações',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Geral',
          icon: 'pi pi-sliders-h',
          routerLink: ['/admin/settings/general'],
        },
        {
          label: 'SEO',
          icon: 'pi pi-search',
          routerLink: ['/admin/settings/seo'],
        },
      ],
    },
    {
      label: 'Voltar ao Blog',
      icon: 'pi pi-external-link',
      routerLink: ['/'],
    },
  ];
}
