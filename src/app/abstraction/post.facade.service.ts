import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostStatusEnum } from '@app/domain/enum/post-status.enum';
import { Post } from '@app/domain/model/post';
import { PostCreate } from '@app/domain/model/post-create';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { PostApiService } from '@app/infrastructure/api/post.api.service';
import { CreatePostRequest } from '@app/infrastructure/contract/request/create-post.request';
import { UpdatePostRequest } from '@app/infrastructure/contract/request/update-post.request';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { PostResponse } from '@app/infrastructure/contract/response/post.response';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostFacadeService {
  constructor(
    private readonly postApiService: PostApiService,
    private readonly authApiService: AuthApiService
  ) {}

  // Buscar todos os posts
  getAllPosts(): Observable<Post[]> {
    return this.postApiService.getAllPosts().pipe(
      map(PostResponse.converter),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }

  // Criar novo post
  createPost(post: PostCreate): Observable<void> {
    const currentUser = this.authApiService.getCurrentUser();

    const request = new CreatePostRequest({
      title: post.title,
      content: post.content,
      status: post.status,
      tags: post.tags,
      authorId: currentUser!.id,
      author: currentUser!.name,
    });

    return this.postApiService
      .createPost(request)
      .pipe(
        catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
      );
  }

  // Atualizar post
  updatePost(id: number, post: UpdatePostRequest): Observable<void> {
    return this.postApiService
      .updatePost(id, post)
      .pipe(
        catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
      );
  }

  // Deletar post
  deletePost(id: number): Observable<void> {
    return this.postApiService
      .deletePost(id)
      .pipe(
        catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
      );
  }

  // Buscar posts por status
  getPostsByStatus(status: PostStatusEnum): Observable<Post[]> {
    return this.postApiService.getPostsByStatus(status).pipe(
      map(PostResponse.converter),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }
}
