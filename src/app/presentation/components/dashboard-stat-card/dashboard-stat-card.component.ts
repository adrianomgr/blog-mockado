import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface StatItem {
  icon: string;
  value: number;
  label: string;
}

@Component({
  selector: 'app-dashboard-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-stat-card.component.html',
  styleUrl: './dashboard-stat-card.component.scss',
})
export class DashboardStatCardComponent {
  @Input() title!: string;
  @Input() icon!: string;
  @Input() totalBadge!: number;
  @Input() stats: StatItem[] = [];

  trackByStat(index: number, stat: StatItem): string {
    return stat.icon + stat.label;
  }
}
