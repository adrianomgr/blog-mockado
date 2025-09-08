import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostFacadeService } from '@app/abstraction/post.facade.service';
import { PostStatusEnum } from '@app/domain/enum/post-status.enum';
import { Post } from '@app/domain/model/post';
import { UserInitialsPipe } from '@app/presentation/pipe/user-initials.pipe';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-public-blog-view',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    AvatarModule,
    DividerModule,
    SkeletonModule,
    UserInitialsPipe,
  ],
  templateUrl: './public-blog-view.component.html',
  styleUrls: ['./public-blog-view.component.scss'],
})
export class PublicBlogViewComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  loading = true;
  private readonly subscription = new Subscription();

  constructor(private readonly postFacadeService: PostFacadeService) {}

  ngOnInit(): void {
    this.loadPublishedPosts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadPublishedPosts(): void {
    this.loading = true;
    const postsSubscription = this.postFacadeService
      .getPostsByStatus(PostStatusEnum.PUBLISHED)
      .subscribe((posts) => {
        this.posts = posts;
        this.loading = false;
      });

    this.subscription.add(postsSubscription);
  }

  get filteredPosts(): Post[] {
    return this.posts;
  }
}
