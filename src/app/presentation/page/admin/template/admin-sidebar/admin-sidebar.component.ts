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
      routerLink: ['/admin/posts'],
    },
    {
      label: 'Usuários',
      icon: 'pi pi-users',
      routerLink: ['/admin/users'],
    },
    {
      label: 'Voltar ao Blog',
      icon: 'pi pi-external-link',
      routerLink: ['/'],
    },
  ];
}
