import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CreatePostRequest, Post, UpdatePostRequest } from '../../domain/interface/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostStore {
  private readonly postsSubject = new BehaviorSubject<Post[]>(this.getInitialPosts());

  // Observable público para componentes se inscreverem
  public posts$ = this.postsSubject.asObservable();

  constructor() {
    console.log('🔧 PostStore initialized with', this.currentPosts.length, 'posts');
  }

  // Getter para acessar o valor atual dos posts
  get currentPosts(): Post[] {
    return this.postsSubject.value;
  }

  // Método para buscar posts por ID
  getPostById(id: number): Observable<Post | undefined> {
    return this.posts$.pipe(map((posts) => posts.find((post) => post.id === id)));
  }

  // Método para buscar posts por status
  getPostsByStatus(status: 'published' | 'draft'): Observable<Post[]> {
    return this.posts$.pipe(map((posts) => posts.filter((post) => post.status === status)));
  }

  // Método para buscar posts por autor
  getPostsByAuthor(authorId: number): Observable<Post[]> {
    return this.posts$.pipe(map((posts) => posts.filter((post) => post.authorId === authorId)));
  }

  // Método para buscar posts por tags
  getPostsByTag(tag: string): Observable<Post[]> {
    return this.posts$.pipe(
      map((posts) =>
        posts.filter((post) =>
          post.tags.some((postTag) => postTag.toLowerCase().includes(tag.toLowerCase()))
        )
      )
    );
  }

  // Método para pesquisar posts por título ou conteúdo
  searchPosts(query: string): Observable<Post[]> {
    return this.posts$.pipe(
      map((posts) =>
        posts.filter(
          (post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  // Método para adicionar um novo post
  addPost(postData: CreatePostRequest): Post {
    const currentPosts = this.currentPosts;
    const newId = Math.max(...currentPosts.map((p) => p.id), 0) + 1;

    const newPost: Post = {
      id: newId,
      ...postData,
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = [...currentPosts, newPost];
    this.postsSubject.next(updatedPosts);

    console.log('➕ Post added:', newPost.title, '| Total posts:', updatedPosts.length);
    return newPost;
  }

  // Método para atualizar um post existente
  updatePost(id: number, updates: UpdatePostRequest): Post | null {
    const currentPosts = this.currentPosts;
    const postIndex = currentPosts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      console.log('❌ Post not found for update:', id);
      return null;
    }

    const updatedPost = { ...currentPosts[postIndex], ...updates };
    const updatedPosts = [...currentPosts];
    updatedPosts[postIndex] = updatedPost;

    this.postsSubject.next(updatedPosts);

    console.log('✏️ Post updated:', updatedPost.title);
    return updatedPost;
  }

  // Método para remover um post
  removePost(id: number): boolean {
    const currentPosts = this.currentPosts;
    const postIndex = currentPosts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      console.log('❌ Post not found for removal:', id);
      return false;
    }

    const removedPost = currentPosts[postIndex];
    const updatedPosts = currentPosts.filter((post) => post.id !== id);
    this.postsSubject.next(updatedPosts);

    console.log('🗑️ Post removed:', removedPost.title, '| Remaining posts:', updatedPosts.length);
    return true;
  }

  // Método para alternar status do post (draft <-> published)
  togglePostStatus(id: number): Post | null {
    const currentPosts = this.currentPosts;
    const post = currentPosts.find((p) => p.id === id);

    if (!post) {
      console.log('❌ Post not found for status toggle:', id);
      return null;
    }

    const newStatus = post.status === 'published' ? 'draft' : 'published';
    return this.updatePost(id, { status: newStatus });
  }

  // Método para obter estatísticas dos posts
  getPostStatistics(): Observable<{
    total: number;
    published: number;
    draft: number;
    byAuthor: { [authorId: number]: number };
    totalTags: number;
    uniqueTags: string[];
  }> {
    return this.posts$.pipe(
      map((posts) => {
        const byAuthor: { [authorId: number]: number } = {};
        const allTags: string[] = [];

        posts.forEach((post) => {
          // Contar posts por autor
          byAuthor[post.authorId] = (byAuthor[post.authorId] || 0) + 1;

          // Coletar todas as tags
          allTags.push(...post.tags);
        });

        const uniqueTags = [...new Set(allTags)];

        return {
          total: posts.length,
          published: posts.filter((p) => p.status === 'published').length,
          draft: posts.filter((p) => p.status === 'draft').length,
          byAuthor,
          totalTags: allTags.length,
          uniqueTags,
        };
      })
    );
  }

  // Método para verificar se existe um post com determinado título
  postTitleExists(title: string, excludeId?: number): boolean {
    return this.currentPosts.some(
      (post) => post.title.toLowerCase() === title.toLowerCase() && post.id !== excludeId
    );
  }

  // Método para obter posts recentes (últimos N posts)
  getRecentPosts(limit: number = 5): Observable<Post[]> {
    return this.posts$.pipe(
      map((posts) => {
        const sortedPosts = [...posts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return sortedPosts.slice(0, limit);
      })
    );
  }

  // Método privado para definir os posts iniciais
  private getInitialPosts(): Post[] {
    return [
      {
        id: 1,
        title: 'Introdução ao Angular 18',
        content:
          'Angular 18 trouxe muitas novidades incríveis para o desenvolvimento web. Neste post, vamos explorar as principais funcionalidades e como elas podem melhorar seus projetos.',
        status: 'published',
        authorId: 1,
        author: 'Administrador do Sistema',
        createdAt: '2024-01-15T10:00:00Z',
        tags: ['angular', 'frontend', 'typescript'],
      },
      {
        id: 2,
        title: 'TypeScript para Iniciantes',
        content:
          'TypeScript é uma linguagem que adiciona tipagem estática ao JavaScript. Vamos aprender os conceitos básicos e como começar a usar TypeScript em seus projetos.',
        status: 'published',
        authorId: 2,
        author: 'Editor de Conteúdo',
        createdAt: '2024-01-10T14:30:00Z',
        tags: ['typescript', 'javascript', 'programming'],
      },
      {
        id: 3,
        title: 'PrimeNG: Componentes Poderosos',
        content:
          'PrimeNG oferece uma ampla gama de componentes UI para Angular. Vamos ver como usar os principais componentes em seus projetos.',
        status: 'draft',
        authorId: 2,
        author: 'Editor de Conteúdo',
        createdAt: '2024-01-08T16:45:00Z',
        tags: ['primeng', 'angular', 'ui', 'components'],
      },
      {
        id: 4,
        title: 'Gerenciamento de Estado com NgRx',
        content:
          'NgRx é uma biblioteca para gerenciamento de estado em aplicações Angular. Aprenda os conceitos fundamentais e como implementar.',
        status: 'published',
        authorId: 1,
        author: 'Administrador do Sistema',
        createdAt: '2024-01-05T11:20:00Z',
        tags: ['ngrx', 'angular', 'state-management', 'rxjs'],
      },
    ];
  }
}
