import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicBlogFacadeService } from '@app/abstraction/public-blog.facade.service';
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

  constructor(private readonly publicBlogFacade: PublicBlogFacadeService) {}

  ngOnInit(): void {
    this.loadPublishedPosts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadPublishedPosts(): void {
    this.loading = true;
    const postsSubscription = this.publicBlogFacade.getPostsPublished().subscribe((posts) => {
      this.posts = posts;
      this.loading = false;
    });

    this.subscription.add(postsSubscription);
  }

  get filteredPosts(): Post[] {
    return this.posts;
  }

  get isAuthenticated(): boolean {
    return this.publicBlogFacade.isAuthenticated();
  }
}
