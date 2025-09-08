import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostStatisticsComponent } from '@app/presentation/components/post-statistics/post-statistics.component';
import { UserCounterComponent } from '@app/presentation/components/user-counter/user-counter.component';
import { CardModule } from 'primeng/card';

interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
  totalComments: number;
}

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, CardModule, PostStatisticsComponent, UserCounterComponent],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss',
})
export class DashboardViewComponent implements OnInit {
  ngOnInit() {
    return;
  }
}
