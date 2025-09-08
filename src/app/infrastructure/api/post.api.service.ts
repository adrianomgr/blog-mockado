import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostStatusEnum } from '@app/domain/enum/post-status.enum';
import { Observable } from 'rxjs';
import { CreatePostRequest } from '../contract/request/create-post.request';
import { UpdatePostRequest } from '../contract/request/update-post.request';
import { PostResponse } from '../contract/response/post.response';

@Injectable({
  providedIn: 'root',
})
export class PostApiService {
  private readonly apiUrl = '/api/posts';

  constructor(private readonly http: HttpClient) {}

  // Buscar todos os posts
  getAllPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(this.apiUrl);
  }

  // Criar novo post
  createPost(post: CreatePostRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, post);
  }

  // Atualizar post
  updatePost(id: number, post: UpdatePostRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, post);
  }

  // Deletar post
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Buscar posts por status
  getPostsByStatus(status: PostStatusEnum): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.apiUrl}?status=${status}`);
  }
}
