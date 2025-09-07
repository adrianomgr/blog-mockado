import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-public-blog-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    AvatarModule,
    DividerModule,
  ],
  templateUrl: './public-blog-view.component.html',
  styleUrls: ['./public-blog-view.component.scss'],
})
export class PublicBlogViewComponent {
  blogPosts = [
    {
      id: 1,
      title: 'Introdução ao novo Angular 20',
      excerpt: 'Descubra as novidades e melhorias da versão mais recente do Angular.',
      author: 'João Silva',
      date: '2025-09-07',
      tags: ['Angular', 'Frontend', 'TypeScript'],
    },
    {
      id: 2,
      title: 'PrimeNG: Criando Interfaces Modernas',
      excerpt: 'Utilize o PrimeNG para criar interfaces elegantes e responsivas.',
      author: 'Maria Santos',
      date: '2025-09-07',
      tags: ['PrimeNG', 'UI/UX', 'Angular'],
    },
    {
      id: 3,
      title: 'Melhores Práticas com TypeScript',
      excerpt: 'Dicas essenciais para escrever código TypeScript limpo e eficiente.',
      author: 'Pedro Costa',
      date: '2025-09-07',
      tags: ['TypeScript', 'Angular', 'JavaScript'],
    },
  ];

  searchTerm = '';

  get filteredPosts() {
    if (!this.searchTerm) {
      return this.blogPosts;
    }

    return this.blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
  }

  viewPost(postId: number) {
    console.log('Visualizar post:', postId);
  }

  getAuthorInitials(authorName: string): string {
    return authorName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
  }
}
