import { ProfileEnum } from '@app/domain/enum/profile.enum';
import { User } from '@app/domain/model/user';

export const UsersMock: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: ProfileEnum.ADMIN,
    name: 'Administrador do Sistema',
    createdAt: '2025-09-06T08:30:00Z',
  },
  {
    id: 2,
    username: 'editor',
    password: 'editor123',
    email: 'editor@example.com',
    role: ProfileEnum.EDITOR,
    name: 'Editor de Conteúdo',
    createdAt: '2025-09-07T14:15:00Z',
  },
  {
    id: 3,
    username: 'user',
    password: 'user123',
    email: 'user@example.com',
    role: ProfileEnum.AUTHOR,
    name: 'Usuário Padrão',
    createdAt: '2025-09-08T10:45:00Z',
  },
];
