import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePostRequest, Post, UpdatePostRequest } from '@app/domain/interface/post.interface';
import { Observable } from 'rxjs';

export interface PostResponse {
  success: boolean;
  message?: string;
  data?: Post;
}

export interface PostListResponse {
  success: boolean;
  message?: string;
  data?: Post[];
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly apiUrl = '/api/posts';

  constructor(private readonly http: HttpClient) {}

  // Buscar todos os posts
  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // Buscar posts publicados (para o blog público)
  getPublishedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?status=published`);
  }

  // Buscar post por ID
  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // Criar novo post
  createPost(post: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  // Atualizar post
  updatePost(id: number, post: UpdatePostRequest): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post);
  }

  // Deletar post
  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Buscar posts por autor
  getPostsByAuthor(authorId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?authorId=${authorId}`);
  }

  // Buscar posts por tag
  getPostsByTag(tag: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?tag=${tag}`);
  }

  // Buscar posts por status
  getPostsByStatus(status: 'published' | 'draft'): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?status=${status}`);
  }
}
