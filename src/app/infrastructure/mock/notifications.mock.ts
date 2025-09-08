import { NotificationSeverityEnum } from '@app/domain/enum/notification-severity.enum';
import { NotificationTypeEnum } from '@app/domain/enum/notification-type.enum';
import { Notification } from '@app/domain/model/notification';

export const NotificationsMock: Notification[] = [
  // Notifications for users creation based on UsersMock
  {
    id: 1,
    type: NotificationTypeEnum.NEW_USER,
    title: 'Novo Usuário Registrado',
    message: 'O usuário "Administrador do Sistema" foi registrado com sucesso',
    timestamp: '2025-09-06T08:30:00Z',
    read: true,
    icon: 'pi pi-user-plus',
    severity: NotificationSeverityEnum.SUCCESS,
  },
  {
    id: 2,
    type: NotificationTypeEnum.NEW_USER,
    title: 'Novo Usuário Registrado',
    message: 'O usuário "Editor de Conteúdo" foi registrado com sucesso',
    timestamp: '2025-09-07T14:15:00Z',
    read: true,
    icon: 'pi pi-user-plus',
    severity: NotificationSeverityEnum.SUCCESS,
  },
  {
    id: 3,
    type: NotificationTypeEnum.NEW_USER,
    title: 'Novo Usuário Registrado',
    message: 'O usuário "Usuário Padrão" foi registrado com sucesso',
    timestamp: '2025-09-08T10:45:00Z',
    read: false,
    icon: 'pi pi-user-plus',
    severity: NotificationSeverityEnum.SUCCESS,
  },
  // Notifications for posts creation based on PostsMock
  {
    id: 4,
    type: NotificationTypeEnum.NEW_POST,
    title: 'Novo Post Criado',
    message: 'O post "Introdução ao novo Angular 20" foi criado com sucesso',
    timestamp: '2025-09-07T10:00:00Z',
    read: true,
    icon: 'pi pi-file-edit',
    severity: NotificationSeverityEnum.INFO,
  },
  {
    id: 5,
    type: NotificationTypeEnum.NEW_POST,
    title: 'Novo Post Criado',
    message: 'O post "PrimeNG: Criando Interfaces Modernas" foi criado com sucesso',
    timestamp: '2025-09-07T10:00:00Z',
    read: false,
    icon: 'pi pi-file-edit',
    severity: NotificationSeverityEnum.INFO,
  },
  {
    id: 6,
    type: NotificationTypeEnum.NEW_POST,
    title: 'Novo Post Criado',
    message: 'O post "Melhores Práticas com TypeScript" foi criado com sucesso',
    timestamp: '2025-09-07T10:00:00Z',
    read: false,
    icon: 'pi pi-file-edit',
    severity: NotificationSeverityEnum.INFO,
  },
  {
    id: 7,
    type: NotificationTypeEnum.NEW_POST,
    title: 'Novo Post Criado',
    message: 'O post "Gerenciamento de Estado com NgRx" foi criado com sucesso',
    timestamp: '2025-09-09T11:20:00Z',
    read: false,
    icon: 'pi pi-file-edit',
    severity: NotificationSeverityEnum.INFO,
  },
];
