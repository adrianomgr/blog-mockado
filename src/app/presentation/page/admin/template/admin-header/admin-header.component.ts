import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [ButtonModule, ToolbarModule, AvatarModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent {
  constructor(private readonly router: Router) {}

  toggleMobileMenu() {
    // Implementar toggle do menu mobile
    console.log('Toggle mobile menu');
  }

  logout() {
    // Implementar logout
    this.router.navigate(['/']);
  }
}
