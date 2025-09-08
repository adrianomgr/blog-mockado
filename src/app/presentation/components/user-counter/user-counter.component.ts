import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserStore } from '@app/infrastructure/store/user.store';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-counter.component.html',
  styleUrl: './user-counter.component.scss',
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

      console.log('📊 Estatísticas de usuários atualizadas:', {
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
