import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

// Domain imports
import { PostFacade } from '@app/abstraction/post.facade';
import { Post } from '@app/domain/interface/post.interface';
import { AuthService } from '@app/infrastructure/api/auth.service';

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    DialogModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.scss',
})
export class PostViewComponent implements OnInit {
  posts: Post[] = [];
  displayDialog: boolean = false;
  postForm!: FormGroup;
  selectedPost: Post | null = null;
  loading: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly postFacade: PostFacade,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadPosts();
  }

  private loadPosts() {
    this.loading = true;
    this.postFacade.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar posts:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar posts',
        });
        this.loading = false;
      },
    });
  }

  private initForm() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      status: ['draft', Validators.required],
      tags: [''],
    });
  }

  showCreateDialog() {
    this.selectedPost = null;
    this.postForm.reset();
    this.postForm.patchValue({ status: 'draft' });
    this.displayDialog = true;
  }

  editPost(post: Post) {
    this.selectedPost = post;
    this.postForm.patchValue({
      title: post.title,
      content: post.content,
      status: post.status,
      tags: post.tags.join(', '),
    });
    this.displayDialog = true;
  }

  deletePost(post: Post) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar o post "${post.title}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.postFacade.deletePost(post.id).subscribe({
          next: () => {
            this.loadPosts(); // Recarregar a lista
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Post deletado com sucesso',
            });
          },
          error: (error) => {
            console.error('Erro ao deletar post:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao deletar post',
            });
          },
        });
      },
    });
  }

  savePost() {
    if (this.postForm.valid) {
      const formValue = this.postForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [];
      const currentUser = this.authService.getCurrentUser();

      if (this.selectedPost) {
        // Editar post existente
        const updateData = {
          title: formValue.title,
          content: formValue.content,
          status: formValue.status,
          tags,
        };

        this.postFacade.updatePost(this.selectedPost.id, updateData).subscribe({
          next: () => {
            this.loadPosts(); // Recarregar a lista
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Post atualizado com sucesso',
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erro ao atualizar post:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao atualizar post',
            });
          },
        });
      } else {
        // Criar novo post
        const newPostData = {
          title: formValue.title,
          content: formValue.content,
          status: formValue.status,
          authorId: currentUser?.id || 1,
          author: currentUser?.name || 'Admin',
          tags,
        };

        this.postFacade.createPost(newPostData).subscribe({
          next: () => {
            this.loadPosts(); // Recarregar a lista
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Post criado com sucesso',
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erro ao criar post:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar post',
            });
          },
        });
      }
    }
  }

  hideDialog() {
    this.displayDialog = false;
    this.selectedPost = null;
    this.postForm.reset();
  }
}
