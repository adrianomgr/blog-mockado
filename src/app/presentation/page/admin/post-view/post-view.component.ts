import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostFacadeService } from '@app/abstraction/post.facade.service';
import { Post } from '@app/domain/model/post';
import { PostCreate } from '@app/domain/model/post-create';
import { UpdatePostRequest } from '@app/infrastructure/contract/request/update-post.request';
import { PostStatusLabelPipe } from '@app/presentation/pipe/post-status-label.pipe';
import { PostStatusSeverityPipe } from '@app/presentation/pipe/post-status-severity.pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-post-view',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    DialogModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    FloatLabelModule,
    SelectModule,
    PostStatusLabelPipe,
    PostStatusSeverityPipe,
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

  statusOptions = [
    { label: 'Rascunho', value: 'draft' },
    { label: 'Publicado', value: 'published' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly postFacade: PostFacadeService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadPosts();
  }

  private loadPosts() {
    this.loading = true;
    this.postFacade.getAllPosts().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error: any) => {
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
      acceptLabel: 'Sim, deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.postFacade.deletePost(post.id).subscribe(() => {
          this.loadPosts();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Post deletado com sucesso',
          });
        });
      },
    });
  }

  savePost() {
    if (this.postForm.valid) {
      const formValue = this.postForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [];

      if (this.selectedPost) {
        // Editar post existente
        const updateRequest = new UpdatePostRequest({
          title: formValue.title,
          content: formValue.content,
          status: formValue.status,
          tags,
        });

        this.postFacade.updatePost(this.selectedPost.id, updateRequest).subscribe(() => {
          this.loadPosts();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Post atualizado com sucesso',
          });
          this.hideDialog();
        });
      } else {
        // Criar novo post
        const postCreate = new PostCreate({
          title: formValue.title,
          content: formValue.content,
          status: formValue.status,
          tags,
        });

        this.postFacade.createPost(postCreate).subscribe(() => {
          this.loadPosts(); // Recarregar a lista
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Post criado com sucesso',
          });
          this.hideDialog();
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
