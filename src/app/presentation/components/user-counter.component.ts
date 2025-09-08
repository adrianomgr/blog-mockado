import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserStore } from '../../infrastructure/store/user.store';

@Component({
  selector: 'app-user-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-counter">
      <h4>👥 Usuários em Tempo Real</h4>
      <div class="stats">
        <span class="total">Total: {{ totalUsers }}</span>
        <span class="admins">Admins: {{ adminCount }}</span>
        <span class="editors">Editores: {{ editorCount }}</span>
        <span class="authors">Autores: {{ authorCount }}</span>
        <span class="subscribers">Assinantes: {{ subscriberCount }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .user-counter {
        background: #f8f9fa;
        padding: 12px;
        border-radius: 8px;
        margin: 10px 0;
        border: 1px solid #dee2e6;
      }

      .user-counter h4 {
        margin: 0 0 8px 0;
        color: #495057;
        font-size: 14px;
      }

      .stats {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .stats span {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
      }

      .total {
        background: #6c757d;
        color: white;
      }

      .admins {
        background: #dc3545;
        color: white;
      }

      .editors {
        background: #fd7e14;
        color: white;
      }

      .authors {
        background: #198754;
        color: white;
      }

      .subscribers {
        background: #0d6efd;
        color: white;
      }
    `,
  ],
})
export class UserCounterComponent implements OnInit, OnDestroy {
  totalUsers = 0;
  adminCount = 0;
  editorCount = 0;
  authorCount = 0;
  subscriberCount = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly userStore: UserStore) {}

  ngOnInit(): void {
    // Se inscrever nas mudanças de usuários - REATIVO!
    this.userStore.users$.pipe(takeUntil(this.destroy$)).subscribe((users: any[]) => {
      this.totalUsers = users.length;
      this.adminCount = users.filter((u: any) => u.role === 'admin').length;
      this.editorCount = users.filter((u: any) => u.role === 'editor').length;
      this.authorCount = users.filter((u: any) => u.role === 'author').length;
      this.subscriberCount = users.filter((u: any) => u.role === 'subscriber').length;

      console.log('📊 Estatísticas atualizadas:', {
        total: this.totalUsers,
        admin: this.adminCount,
        editor: this.editorCount,
        author: this.authorCount,
        subscriber: this.subscriberCount,
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
