import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserFacadeService } from '@app/abstraction/user-facade.service';
import { Constants } from '@app/constants';
import { ProfileEnum } from '@app/domain/enum/profile.enum';
import { User } from '@app/domain/model/user';
import { CreateUserRequest } from '@app/infrastructure/contract/request/create-user.request';
import { UpdateUserRequest } from '@app/infrastructure/contract/request/update-user.request';
import { RoleLabelPipe } from '@app/presentation/pipe/role-label.pipe';
import { RoleSeverityPipe } from '@app/presentation/pipe/role-severity.pipe';
import { UserInitialsPipe } from '@app/presentation/pipe/user-initials.pipe';
import { passwordMatchValidator } from '@app/presentation/validators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-users-view',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    PasswordModule,
    TagModule,
    TooltipModule,
    AvatarModule,
    FloatLabelModule,
    SelectModule,
    UserInitialsPipe,
    RoleLabelPipe,
    RoleSeverityPipe,
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

  roleOptions = Object.entries(Constants.descricoesProfile).map(([key, value]) => ({
    value: key as ProfileEnum,
    label: value,
  }));

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
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: [ProfileEnum.AUTHOR, Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator() }
    );
  }

  private loadUsers() {
    this.loading = true;
    this.userFacade
      .getAllUsers()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((users: User[]) => {
        this.users = users;
        this.loading = false;
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
    this.userForm.get('confirmPassword')?.clearValidators();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
    this.isEditMode = true;
    this.displayDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar o usuário "${user.name}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.userFacade.deleteUser(user.id).subscribe(() => {
          this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário deletado com sucesso',
          });
        });
      },
    });
  }

  showCreateDialog() {
    this.selectedUser = null;
    this.isEditMode = false;
    this.userForm.reset();
    this.userForm.patchValue({
      role: ProfileEnum.AUTHOR,
    });
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
    this.displayDialog = true;
  }

  saveUser() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.isEditMode && this.selectedUser) {
        // Editar usuário existente
        const updateRequest = new UpdateUserRequest({
          id: this.selectedUser.id,
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

        this.userFacade.createUser(createRequest).subscribe(() => {
          this.loadUsers();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário criado com sucesso',
          });
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
}
