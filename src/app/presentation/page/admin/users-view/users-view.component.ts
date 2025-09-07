import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'subscriber';
  status: 'active' | 'inactive';
  createdAt: Date;
  lastLogin: Date | null;
}

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
    DatePipe,
  ],
  providers: [MessageService, ConfirmationService],
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
                <th>Status</th>
                <th>Último Login</th>
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
                <td>
                  <p-tag
                    [value]="user.status === 'active' ? 'Ativo' : 'Inativo'"
                    [severity]="user.status === 'active' ? 'success' : 'danger'"
                  ></p-tag>
                </td>
                <td>
                  {{ user.lastLogin ? (user.lastLogin | date : 'dd/MM/yyyy HH:mm') : 'Nunca' }}
                </td>
                <td>
                  <p-button
                    icon="pi pi-pencil"
                    severity="info"
                    [text]="true"
                    (onClick)="editUser(user)"
                    title="Editar"
                  ></p-button>
                  <p-button
                    [icon]="user.status === 'active' ? 'pi pi-ban' : 'pi pi-check'"
                    severity="secondary"
                    [text]="true"
                    (onClick)="toggleUserStatus(user)"
                    [title]="user.status === 'active' ? 'Desativar' : 'Ativar'"
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

            <div class="form-field">
              <label for="status">Status *</label>
              <select id="status" formControlName="status" class="p-inputtext w-full">
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
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
  users: User[] = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      role: 'editor',
      status: 'active',
      createdAt: new Date('2024-01-05'),
      lastLogin: new Date('2024-01-14'),
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      role: 'subscriber',
      status: 'inactive',
      createdAt: new Date('2024-01-10'),
      lastLogin: null,
    },
  ];

  displayDialog: boolean = false;
  userForm!: FormGroup;
  selectedUser: User | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['subscriber', Validators.required],
      status: ['active', Validators.required],
      password: ['', Validators.required],
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

  getRoleLabel(role: string): string {
    const roleMap: { [key: string]: string } = {
      admin: 'Admin',
      editor: 'Editor',
      subscriber: 'Assinante',
    };
    return roleMap[role] || role;
  }

  getRoleSeverity(role: string): string {
    const severityMap: { [key: string]: string } = {
      admin: 'danger',
      editor: 'warning',
      subscriber: 'info',
    };
    return severityMap[role] || 'info';
  }

  showCreateDialog() {
    this.selectedUser = null;
    this.userForm.reset();
    this.userForm.patchValue({
      role: 'subscriber',
      status: 'active',
    });
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.displayDialog = true;
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.displayDialog = true;
  }

  toggleUserStatus(user: User) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'ativar' : 'desativar';

    this.confirmationService.confirm({
      message: `Tem certeza que deseja ${action} o usuário "${user.name}"?`,
      header: 'Confirmar Ação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        user.status = newStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Usuário ${action === 'ativar' ? 'ativado' : 'desativado'} com sucesso`,
        });
      },
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar o usuário "${user.name}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário deletado com sucesso',
        });
      },
    });
  }

  saveUser() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.selectedUser) {
        // Editar usuário existente
        const index = this.users.findIndex((u) => u.id === this.selectedUser!.id);
        this.users[index] = {
          ...this.selectedUser,
          name: formValue.name,
          email: formValue.email,
          role: formValue.role,
          status: formValue.status,
        };
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário atualizado com sucesso',
        });
      } else {
        // Criar novo usuário
        const newUser: User = {
          id: Math.max(...this.users.map((u) => u.id)) + 1,
          name: formValue.name,
          email: formValue.email,
          role: formValue.role,
          status: formValue.status,
          createdAt: new Date(),
          lastLogin: null,
        };
        this.users.push(newUser);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário criado com sucesso',
        });
      }

      this.hideDialog();
    }
  }

  hideDialog() {
    this.displayDialog = false;
    this.selectedUser = null;
    this.userForm.reset();
  }
}
