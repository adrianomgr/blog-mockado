import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CreatePostRequest, Post, UpdatePostRequest } from '../domain/interface/post.interface';
import { PostService } from '../infrastructure/api/post.service';

@Injectable({
  providedIn: 'root',
})
export class PostFacade {
  constructor(private readonly postService: PostService) {}

  // Buscar todos os posts
  getAllPosts(): Observable<Post[]> {
    return this.postService.getAllPosts().pipe(
      catchError((error) => {
        console.error('Erro ao buscar posts:', error);
        throw error;
      })
    );
  }

  // Buscar posts publicados para o blog público
  getPublishedPosts(): Observable<Post[]> {
    return this.postService.getPublishedPosts().pipe(
      catchError((error) => {
        console.error('Erro ao buscar posts publicados:', error);
        throw error;
      })
    );
  }

  // Buscar post por ID
  getPostById(id: number): Observable<Post> {
    return this.postService.getPostById(id).pipe(
      catchError((error) => {
        console.error('Erro ao buscar post por ID:', error);
        throw error;
      })
    );
  }

  // Criar novo post
  createPost(post: CreatePostRequest): Observable<Post> {
    return this.postService.createPost(post).pipe(
      map((response) => {
        console.log('Post criado com sucesso:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Erro ao criar post:', error);
        throw error;
      })
    );
  }

  // Atualizar post
  updatePost(id: number, post: UpdatePostRequest): Observable<Post> {
    return this.postService.updatePost(id, post).pipe(
      map((response) => {
        console.log('Post atualizado com sucesso:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Erro ao atualizar post:', error);
        throw error;
      })
    );
  }

  // Deletar post
  deletePost(id: number): Observable<any> {
    return this.postService.deletePost(id).pipe(
      map((response) => {
        console.log('Post deletado com sucesso');
        return response;
      }),
      catchError((error) => {
        console.error('Erro ao deletar post:', error);
        throw error;
      })
    );
  }

  // Buscar posts por autor
  getPostsByAuthor(authorId: number): Observable<Post[]> {
    return this.postService.getPostsByAuthor(authorId).pipe(
      catchError((error) => {
        console.error('Erro ao buscar posts por autor:', error);
        throw error;
      })
    );
  }

  // Buscar posts por tag
  getPostsByTag(tag: string): Observable<Post[]> {
    return this.postService.getPostsByTag(tag).pipe(
      catchError((error) => {
        console.error('Erro ao buscar posts por tag:', error);
        throw error;
      })
    );
  }

  // Buscar posts por status
  getPostsByStatus(status: 'published' | 'draft'): Observable<Post[]> {
    return this.postService.getPostsByStatus(status).pipe(
      catchError((error) => {
        console.error('Erro ao buscar posts por status:', error);
        throw error;
      })
    );
  }

  // Métodos utilitários
  getPostsCount(): Observable<number> {
    return this.getAllPosts().pipe(map((posts) => posts.length));
  }

  getPublishedPostsCount(): Observable<number> {
    return this.getPublishedPosts().pipe(map((posts) => posts.length));
  }

  getDraftPostsCount(): Observable<number> {
    return this.getPostsByStatus('draft').pipe(map((posts) => posts.length));
  }

  // Método para contar total de posts
  getTotalPostsCount(): Observable<number> {
    return this.getAllPosts().pipe(map((posts) => posts.length));
  }
}
