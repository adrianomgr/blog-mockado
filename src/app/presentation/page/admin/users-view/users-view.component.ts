import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserFacade } from '@app/abstraction/user.facade';
import { User } from '@app/domain/interface/user.interface';
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
  providers: [MessageService, ConfirmationService, UserFacade],
  template: `
    <div class="users-management">
      <div class="page-header">
        <h1>Gerenciar Usuários</h1>
        <p-button
          label="Novo Usuário"
          icon="pi pi-user-plus"
          (onClick)="showCreateDialog()"
        ></p-button>
      </div>

      <p-card class="users-table-card">
        <ng-template pTemplate="content">
          <p-table
            [value]="users"
            [paginator]="true"
            [rows]="10"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuários"
            [globalFilterFields]="['name', 'email', 'role']"
            #dt
          >
            <ng-template pTemplate="caption">
              <div class="table-header">
                <span class="p-input-icon-left">
                  <i class="pi pi-search"></i>
                  <input pInputText type="text" placeholder="Buscar usuários..." />
                </span>
              </div>
            </ng-template>

            <ng-template pTemplate="header">
              <tr>
                <th>Avatar</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Data da criação</th>
                <th>Ações</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-user>
              <tr>
                <td>
                  <p-avatar
                    [label]="getUserInitials(user.name)"
                    shape="circle"
                    size="normal"
                  ></p-avatar>
                </td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <p-tag
                    [value]="getRoleLabel(user.role)"
                    [severity]="getRoleSeverity(user.role)"
                  ></p-tag>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <p-button
                    icon="pi pi-pencil"
                    severity="info"
                    [text]="true"
                    (onClick)="editUser(user)"
                    title="Editar"
                  ></p-button>
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    [text]="true"
                    (onClick)="deleteUser(user)"
                    pTooltip="Deletar"
                  ></p-button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </ng-template>
      </p-card>

      <p-dialog
        header="Gerenciar Usuário"
        [(visible)]="displayDialog"
        [modal]="true"
        [style]="{ width: '600px' }"
        [closable]="true"
      >
        <form [formGroup]="userForm" (ngSubmit)="saveUser()">
          <div class="form-grid">
            <div class="form-field">
              <label for="name">Nome Completo *</label>
              <input id="name" type="text" pInputText formControlName="name" class="w-full" />
            </div>

            <div class="form-field">
              <label for="email">Email *</label>
              <input id="email" type="email" pInputText formControlName="email" class="w-full" />
            </div>

            <div class="form-field">
              <label for="role">Função *</label>
              <select id="role" formControlName="role" class="p-inputtext w-full">
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
                <option value="subscriber">Assinante</option>
              </select>
            </div>

            @if (!selectedUser) {
            <div class="form-field">
              <label for="password">Senha *</label>
              <p-password
                id="password"
                formControlName="password"
                [feedback]="false"
                [toggleMask]="true"
                class="w-full"
              ></p-password>
            </div>
            }
          </div>

          <div class="dialog-footer">
            <p-button label="Cancelar" severity="secondary" (onClick)="hideDialog()"></p-button>
            <p-button label="Salvar" type="submit" [disabled]="userForm.invalid"></p-button>
          </div>
        </form>
      </p-dialog>
    </div>
  `,
  styleUrl: './users-view.component.scss',
})
export class UsersViewComponent implements OnInit {
  users: User[] = [];
  loading = false;
  displayDialog = false;
  userForm!: FormGroup;
  isEditMode = false;
  selectedUser: User | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly userFacade: UserFacade
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
    this.userFacade.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar usuários',
        });
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
          error: (error) => {
            console.error('Erro ao deletar usuário:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao deletar usuário',
            });
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
        const updateRequest = {
          name: formValue.name,
          username: formValue.username,
          email: formValue.email,
          role: formValue.role,
        };

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
          error: (error) => {
            console.error('Erro ao atualizar usuário:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao atualizar usuário',
            });
          },
        });
      } else {
        // Criar novo usuário
        const createRequest = {
          name: formValue.name,
          username: formValue.username,
          email: formValue.email,
          password: formValue.password,
          role: formValue.role,
        };

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
          error: (error) => {
            console.error('Erro ao criar usuário:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar usuário',
            });
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
