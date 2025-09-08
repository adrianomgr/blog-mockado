import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserFacadeService } from '@app/abstraction/user-facade.service';
import { User } from '@app/domain/model/user';
import { CreateUserRequest } from '@app/infrastructure/contract/request/create-user.request';
import { UpdateUserRequest } from '@app/infrastructure/contract/request/update-user.request';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-users-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    TagModule,
    TooltipModule,
    AvatarModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users-view.component.html',
  styleUrl: './users-view.component.scss',
})
export class UsersViewComponent implements OnInit {
  users: User[] = [];
  loading = false;
  displayDialog = false;
  userForm!: FormGroup;
  isEditMode = false;
  selectedUser: User | null = null;

  roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'editor', label: 'Editor' },
    { value: 'author', label: 'Autor' },
    { value: 'subscriber', label: 'Assinante' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly userFacade: UserFacadeService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUsers();
  }

  private initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['author', Validators.required],
      password: ['', Validators.required],
    });
  }

  private loadUsers() {
    this.loading = true;
    this.userFacade
      .getAllUsers()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (users: User[]) => {
          this.users = users;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar usuários:', error);
          this.loading = false;
        },
      });
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.userForm.patchValue({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: (user as any).status || 'active',
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.isEditMode = true;
    this.displayDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar o usuário "${user.name}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userFacade.deleteUser(user.id).subscribe({
          next: () => {
            this.loadUsers();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário deletado com sucesso',
            });
          },
          error: (error: any) => {
            console.error('Erro ao deletar usuário:', error);
          },
        });
      },
    });
  }

  showCreateDialog() {
    this.selectedUser = null;
    this.isEditMode = false;
    this.userForm.reset();
    this.userForm.patchValue({
      role: 'author',
    });
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.displayDialog = true;
  }

  saveUser() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.isEditMode && this.selectedUser) {
        // Editar usuário existente
        const updateRequest = new UpdateUserRequest({
          name: formValue.name,
          username: formValue.username,
          email: formValue.email,
          role: formValue.role,
        });

        this.userFacade.updateUser(this.selectedUser.id, updateRequest).subscribe({
          next: () => {
            this.loadUsers();
            this.hideDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário atualizado com sucesso',
            });
          },
          error: (error: any) => {
            console.error('Erro ao atualizar usuário:', error);
          },
        });
      } else {
        // Criar novo usuário
        const createRequest = new CreateUserRequest({
          name: formValue.name,
          username: formValue.username,
          email: formValue.email,
          password: formValue.password,
          role: formValue.role,
        });

        this.userFacade.createUser(createRequest).subscribe({
          next: () => {
            this.loadUsers();
            this.hideDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário criado com sucesso',
            });
          },
          error: (error: any) => {
            console.error('Erro ao criar usuário:', error);
          },
        });
      }
    }
  }

  hideDialog() {
    this.displayDialog = false;
    this.selectedUser = null;
    this.isEditMode = false;
    this.userForm.reset();
  }

  getRoleLabel(role: any): string {
    const roleMap: { [key: string]: string } = {
      admin: 'Admin',
      editor: 'Editor',
      author: 'Autor',
    };
    return roleMap[role] || role;
  }

  getRoleSeverity(role: any): 'success' | 'info' | 'warning' | 'danger' {
    const severityMap: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      admin: 'danger',
      editor: 'warning',
      author: 'info',
    };
    return severityMap[role] || 'info';
  }
}
