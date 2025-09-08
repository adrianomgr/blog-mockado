import { Injectable } from '@angular/core';
import { PostStatistics } from '@app/domain/model/post-statistics';
import { UserStatistics } from '@app/domain/model/user-statistics';
import { PostApiService } from '@app/infrastructure/api/post.api.service';
import { UserApiService } from '@app/infrastructure/api/user.api.service';
import { PostResponse } from '@app/infrastructure/contract/response/post.response';
import { UserResponse } from '@app/infrastructure/contract/response/user.response';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardFacadeService {
  constructor(
    private readonly userService: UserApiService,
    private readonly postService: PostApiService
  ) {}

  getUserStatistics(): Observable<UserStatistics> {
    return this.userService.getAllUsers().pipe(
      map(UserResponse.convertToStatistics)
    );
  }

  getPostStatistics(): Observable<PostStatistics> {
    return this.postService.getAllPosts().pipe(
      map(PostResponse.convertToStatistics)
    );
  }
}
