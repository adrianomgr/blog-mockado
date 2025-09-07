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

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  status: 'published' | 'draft';
  createdAt: Date;
  tags: string[];
}

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
  posts: Post[] = [
    {
      id: 1,
      title: 'Introdução ao Angular 17',
      content: 'Conteúdo do post sobre Angular 17...',
      author: 'João Silva',
      status: 'published',
      createdAt: new Date('2024-01-15'),
      tags: ['angular', 'typescript', 'frontend'],
    },
    {
      id: 2,
      title: 'TypeScript para Iniciantes',
      content: 'Guia completo sobre TypeScript...',
      author: 'Maria Santos',
      status: 'draft',
      createdAt: new Date('2024-01-10'),
      tags: ['typescript', 'javascript', 'programming'],
    },
  ];

  displayDialog: boolean = false;
  postForm!: FormGroup;
  selectedPost: Post | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initForm();
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
        this.posts = this.posts.filter((p) => p.id !== post.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Post deletado com sucesso',
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
        const index = this.posts.findIndex((p) => p.id === this.selectedPost!.id);
        this.posts[index] = {
          ...this.selectedPost,
          title: formValue.title,
          content: formValue.content,
          status: formValue.status,
          tags,
        };
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Post atualizado com sucesso',
        });
      } else {
        // Criar novo post
        const newPost: Post = {
          id: Math.max(...this.posts.map((p) => p.id)) + 1,
          title: formValue.title,
          content: formValue.content,
          author: 'Admin',
          status: formValue.status,
          createdAt: new Date(),
          tags,
        };
        this.posts.push(newPost);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Post criado com sucesso',
        });
      }

      this.hideDialog();
    }
  }

  hideDialog() {
    this.displayDialog = false;
    this.selectedPost = null;
    this.postForm.reset();
  }
}
