import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardFacadeService } from '@app/abstraction/dashboard.facade.service';
import { PostStatistics } from '@app/domain/model/post-statistics';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-statistics.component.html',
  styleUrl: './post-statistics.component.scss',
})
export class PostStatisticsComponent implements OnInit, OnDestroy {
  statistics: PostStatistics = new PostStatistics();

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly dashboardFacade: DashboardFacadeService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.dashboardFacade.getPostStatistics().subscribe((stats: PostStatistics) => {
        this.statistics = stats;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
