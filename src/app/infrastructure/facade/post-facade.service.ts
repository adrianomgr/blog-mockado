import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { CreatePostRequest, Post, UpdatePostRequest } from '../../domain/interface/post.interface';
import { PostStore } from '../store/post.store';
import { UserStore } from '../store/user.store';

@Injectable({
  providedIn: 'root',
})
export class PostFacadeService {
  constructor(private readonly postStore: PostStore, private readonly userStore: UserStore) {}

  // Observable dos posts
  get posts$(): Observable<Post[]> {
    return this.postStore.posts$;
  }

  // Posts publicados
  get publishedPosts$(): Observable<Post[]> {
    return this.postStore.getPostsByStatus('published');
  }

  // Posts em rascunho
  get draftPosts$(): Observable<Post[]> {
    return this.postStore.getPostsByStatus('draft');
  }

  // Posts recentes
  getRecentPosts$(limit: number = 5): Observable<Post[]> {
    return this.postStore.getRecentPosts(limit);
  }

  // Estatísticas dos posts
  getPostStatistics$(): Observable<{
    total: number;
    published: number;
    draft: number;
    byAuthor: { [authorId: number]: number };
    totalTags: number;
    uniqueTags: string[];
  }> {
    return this.postStore.getPostStatistics();
  }

  // Posts com informações do autor enriquecidas
  getPostsWithAuthorInfo$(): Observable<(Post & { authorName?: string })[]> {
    return combineLatest([this.postStore.posts$, this.userStore.users$]).pipe(
      map(([posts, users]) =>
        posts.map((post) => {
          const author = users.find((user) => user.id === post.authorId);
          return {
            ...post,
            authorName: author ? author.name : post.author,
          };
        })
      )
    );
  }

  // Buscar post por ID
  getPostById$(id: number): Observable<Post | undefined> {
    return this.postStore.getPostById(id);
  }

  // Posts por autor
  getPostsByAuthor$(authorId: number): Observable<Post[]> {
    return this.postStore.getPostsByAuthor(authorId);
  }

  // Posts por tag
  getPostsByTag$(tag: string): Observable<Post[]> {
    return this.postStore.getPostsByTag(tag);
  }

  // Pesquisar posts
  searchPosts$(query: string): Observable<Post[]> {
    return this.postStore.searchPosts(query);
  }

  // Adicionar post
  addPost(postData: CreatePostRequest): Post {
    return this.postStore.addPost(postData);
  }

  // Atualizar post
  updatePost(id: number, updates: UpdatePostRequest): Post | null {
    return this.postStore.updatePost(id, updates);
  }

  // Remover post
  removePost(id: number): boolean {
    return this.postStore.removePost(id);
  }

  // Alternar status do post
  togglePostStatus(id: number): Post | null {
    return this.postStore.togglePostStatus(id);
  }

  // Verificar se título já existe
  postTitleExists(title: string, excludeId?: number): boolean {
    return this.postStore.postTitleExists(title, excludeId);
  }

  // Obter posts por múltiplas tags
  getPostsByMultipleTags$(tags: string[]): Observable<Post[]> {
    return this.postStore.posts$.pipe(
      map((posts) => posts.filter((post) => this.hasAllTags(post, tags)))
    );
  }

  // Método auxiliar para verificar se um post contém todas as tags
  private hasAllTags(post: Post, tags: string[]): boolean {
    return tags.every((tag) =>
      post.tags.some((postTag) => postTag.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  // Obter posts mais populares (por número de tags, como proxy para popularidade)
  getPopularPosts$(limit: number = 5): Observable<Post[]> {
    return this.postStore.posts$.pipe(
      map((posts) => {
        const sortedPosts = [...posts].sort((a, b) => b.tags.length - a.tags.length);
        return sortedPosts.slice(0, limit);
      })
    );
  }

  // Obter dashboard com estatísticas completas
  getDashboardData$(): Observable<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    recentPosts: Post[];
    popularTags: string[];
    postsByAuthor: { [authorId: number]: number };
  }> {
    return combineLatest([
      this.postStore.getPostStatistics(),
      this.postStore.getRecentPosts(3),
    ]).pipe(
      map(([stats, recentPosts]) => ({
        totalPosts: stats.total,
        publishedPosts: stats.published,
        draftPosts: stats.draft,
        recentPosts,
        popularTags: stats.uniqueTags.slice(0, 10), // Top 10 tags
        postsByAuthor: stats.byAuthor,
      }))
    );
  }

  // Validar dados do post
  validatePostData(postData: Partial<CreatePostRequest>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!postData.title || postData.title.trim().length === 0) {
      errors.push('Título é obrigatório');
    } else if (postData.title.trim().length < 3) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    } else if (postData.title.trim().length > 200) {
      errors.push('Título deve ter no máximo 200 caracteres');
    }

    if (!postData.content || postData.content.trim().length === 0) {
      errors.push('Conteúdo é obrigatório');
    } else if (postData.content.trim().length < 10) {
      errors.push('Conteúdo deve ter pelo menos 10 caracteres');
    }

    if (!postData.authorId || postData.authorId <= 0) {
      errors.push('Autor é obrigatório');
    }

    if (!postData.status || !['published', 'draft'].includes(postData.status)) {
      errors.push('Status deve ser "published" ou "draft"');
    }

    if (postData.tags && postData.tags.length > 10) {
      errors.push('Máximo de 10 tags permitidas');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
