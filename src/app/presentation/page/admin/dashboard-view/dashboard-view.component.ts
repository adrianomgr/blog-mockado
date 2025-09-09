import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardFacadeService } from '@app/abstraction/dashboard.facade.service';
import { PostStatistics } from '@app/domain/model/post-statistics';
import { UserStatistics } from '@app/domain/model/user-statistics';
import {
  DashboardStatCardComponent,
  StatItem,
} from '@app/presentation/components/dashboard-stat-card/dashboard-stat-card.component';
import { CardModule } from 'primeng/card';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-view',
  imports: [CommonModule, CardModule, DashboardStatCardComponent],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss',
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  userStats: UserStatistics = new UserStatistics();
  postStats: PostStatistics = new PostStatistics();

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly dashboardFacade: DashboardFacadeService) {}

  ngOnInit(): void {
    this.dashboardFacade
      .getUserStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats: UserStatistics) => {
        this.userStats = stats;
      });

    this.dashboardFacade
      .getPostStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats: PostStatistics) => {
        this.postStats = stats;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserStatItems(): StatItem[] {
    return [
      { icon: 'pi pi-users', value: this.userStats.totalUsers, label: 'Total de Usuários' },
      { icon: 'pi pi-crown', value: this.userStats.adminCount, label: 'Administradores' },
      { icon: 'pi pi-pencil', value: this.userStats.editorCount, label: 'Editores' },
      { icon: 'pi pi-user-edit', value: this.userStats.authorCount, label: 'Autores' },
    ];
  }

  getPostStatItems(): StatItem[] {
    return [
      { icon: 'pi pi-file', value: this.postStats.totalPosts || 0, label: 'Total de Posts' },
      { icon: 'pi pi-check-circle', value: this.postStats.publishedCount, label: 'Publicados' },
      { icon: 'pi pi-file-edit', value: this.postStats.draftCount || 0, label: 'Rascunhos' },
      { icon: 'pi pi-tags', value: this.postStats.uniqueTags?.length || 0, label: 'Tags' },
    ];
  }
}
