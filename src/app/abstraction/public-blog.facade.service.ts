import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostStatusEnum } from '@app/domain/enum/post-status.enum';
import { Post } from '@app/domain/model/post';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { PostApiService } from '@app/infrastructure/api/post.api.service';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { PostResponse } from '@app/infrastructure/contract/response/post.response';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PublicBlogFacadeService {
  constructor(
    private readonly postApiService: PostApiService,
    private readonly authApiService: AuthApiService
  ) {}

  // Buscar posts publicados
  getPostsPublished(): Observable<Post[]> {
    return this.postApiService.getPostsByStatus(PostStatusEnum.PUBLISHED).pipe(
      map(PostResponse.converter),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return this.authApiService.isAuthenticated();
  }
}
