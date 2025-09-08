import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardFacadeService } from '@app/abstraction/dashboard.facade.service';
import { UserStatistics } from '@app/domain/model/user-statistics';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-counter.component.html',
  styleUrl: './user-counter.component.scss',
})
export class UserCounterComponent implements OnInit, OnDestroy {
  statistics: UserStatistics = new UserStatistics();

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly dashboardFacade: DashboardFacadeService) {}

  ngOnInit(): void {
    this.dashboardFacade
      .getUserStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats: UserStatistics) => {
        this.statistics = stats;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
