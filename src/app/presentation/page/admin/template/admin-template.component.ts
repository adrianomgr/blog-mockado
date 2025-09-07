import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-template',
  standalone: true,
  imports: [AdminLayoutComponent, ToastModule, ConfirmDialogModule],
  template: `
    <app-admin-layout></app-admin-layout>
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `,
  styleUrl: './admin-template.component.scss',
})
export class AdminTemplateComponent {}
