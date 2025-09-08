import { Injectable } from '@angular/core';
import { PostStatusEnum } from '@app/domain/enum/post-status.enum';
import { Post } from '@app/domain/model/post';
import { PostsMock } from '@app/infrastructure/mock/posts.mock';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CreatePostRequest } from '../../contract/request/create-post.request';
import { UpdatePostRequest } from '../../contract/request/update-post.request';

@Injectable({
  providedIn: 'root',
})
export class PostStore {
  private readonly mockPosts: Post[] = PostsMock as Post[];
  private readonly postsSubject = new BehaviorSubject<Post[]>(this.mockPosts);
  private readonly posts$ = this.postsSubject.asObservable();

  constructor() {}

  get currentPosts(): Post[] {
    return this.postsSubject.value;
  }

  // Método para buscar posts por status
  getPostsByStatus(status: PostStatusEnum): Observable<Post[]> {
    return this.posts$.pipe(map((posts) => posts.filter((post) => post.status === status)));
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

    return newPost;
  }

  // Método para atualizar um post existente
  updatePost(id: number, updates: UpdatePostRequest): Post | null {
    const currentPosts = this.currentPosts;
    const postIndex = currentPosts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return null;
    }

    const updatedPost = { ...currentPosts[postIndex], ...updates };
    const updatedPosts = [...currentPosts];
    updatedPosts[postIndex] = updatedPost;

    this.postsSubject.next(updatedPosts);

    return updatedPost;
  }

  // Método para remover um post
  removePost(id: number): boolean {
    const currentPosts = this.currentPosts;
    const postIndex = currentPosts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return false;
    }

    const removedPost = currentPosts[postIndex];
    const updatedPosts = currentPosts.filter((post) => post.id !== id);
    this.postsSubject.next(updatedPosts);

    return true;
  }
}
