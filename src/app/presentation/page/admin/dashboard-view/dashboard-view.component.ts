import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PostStatisticsComponent } from '../../../components/post-statistics.component';

interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
  totalComments: number;
}

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, CardModule, PostStatisticsComponent],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss',
})
export class DashboardViewComponent implements OnInit {
  stats: DashboardStats = {
    totalPosts: 24,
    totalUsers: 156,
    totalViews: 1834,
    totalComments: 89,
  };

  recentActivities = [
    {
      id: 1,
      icon: 'pi pi-file-edit',
      description: 'Novo post "Angular 17" foi criado',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    },
    {
      id: 2,
      icon: 'pi pi-user-plus',
      description: 'Novo usuário se registrou',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    },
    {
      id: 3,
      icon: 'pi pi-comment',
      description: 'Novo comentário em "TypeScript Tips"',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    },
    {
      id: 4,
      icon: 'pi pi-pencil',
      description: 'Post "React vs Angular" foi editado',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
    },
  ];

  ngOnInit() {
    // Inicialização se necessária
  }
}
