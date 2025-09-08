import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Subscription } from 'rxjs';
import { PostFacadeService } from '../../infrastructure/facade/post-facade.service';

@Component({
  selector: 'app-post-statistics',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card header="📊 Estatísticas dos Posts - Tempo Real">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded">
          <div class="text-2xl font-bold text-blue-600">{{ stats?.total || 0 }}</div>
          <div class="text-sm text-gray-600">Total de Posts</div>
        </div>

        <div class="text-center p-4 bg-green-50 rounded">
          <div class="text-2xl font-bold text-green-600">{{ stats?.published || 0 }}</div>
          <div class="text-sm text-gray-600">Publicados</div>
        </div>

        <div class="text-center p-4 bg-yellow-50 rounded">
          <div class="text-2xl font-bold text-yellow-600">{{ stats?.draft || 0 }}</div>
          <div class="text-sm text-gray-600">Rascunhos</div>
        </div>

        <div class="text-center p-4 bg-purple-50 rounded">
          <div class="text-2xl font-bold text-purple-600">{{ stats?.uniqueTags?.length || 0 }}</div>
          <div class="text-sm text-gray-600">Tags Únicas</div>
        </div>
      </div>

      <div class="mt-4" *ngIf="stats && stats.uniqueTags && stats.uniqueTags.length > 0">
        <h4 class="text-lg font-semibold mb-2">🏷️ Tags Disponíveis:</h4>
        <div class="flex flex-wrap gap-2">
          <span
            *ngFor="let tag of stats.uniqueTags.slice(0, 10)"
            class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </p-card>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-bottom: 1rem;
      }
    `,
  ],
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
    // Inscrever-se nas estatísticas dos posts para atualizações em tempo real
    this.subscription.add(
      this.postFacade.getPostStatistics$().subscribe((stats) => {
        this.stats = stats;
        console.log('📊 Post statistics updated:', stats);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
