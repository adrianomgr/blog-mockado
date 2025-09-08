import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostFacadeService } from '@app/abstraction/post.facade.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-statistics.component.html',
  styleUrl: './post-statistics.component.scss',
})
export class PostStatisticsComponent implements OnInit, OnDestroy {
  stats: {
    total: number;
    published: number;
    draft: number;
    byAuthor: { [authorId: number]: number };
    totalTags: number;
    uniqueTags: string[];
  } | null = null;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly postFacade: PostFacadeService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.postFacade.getPostStatistics$().subscribe((stats) => {
        this.stats = stats;
        console.log('📊 Estatísticas de posts atualizadas:', stats);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
