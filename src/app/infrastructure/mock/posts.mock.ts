import { PostStatusEnum } from '@app/domain/enum/post-status.enum';
import { Post } from '@app/domain/model/post';

export const PostsMock: Post[] = [
  {
    id: 1,
    title: 'Introdução ao novo Angular 20',
    content: 'Descubra as novidades e melhorias da versão mais recente do Angular.',
    authorId: 1,
    author: 'Administrador do Sistema',
    createdAt: '2025-09-07T10:00:00Z',
    status: PostStatusEnum.PUBLISHED,
    tags: ['Angular', 'Frontend', 'TypeScript'],
  },
  {
    id: 2,
    title: 'PrimeNG: Criando Interfaces Modernas',
    content: 'Utilize o PrimeNG para criar interfaces elegantes e responsivas.',
    authorId: 2,
    author: 'Editor de Conteúdo',
    createdAt: '2025-09-07T10:00:00Z',
    status: PostStatusEnum.PUBLISHED,
    tags: ['PrimeNG', 'UI/UX', 'Angular'],
  },
  {
    id: 3,
    title: 'Melhores Práticas com TypeScript',
    content: 'Dicas essenciais para escrever código TypeScript limpo e eficiente.',
    authorId: 3,
    author: 'Usuário Padrão',
    createdAt: '2025-09-07T10:00:00Z',
    status: PostStatusEnum.PUBLISHED,
    tags: ['TypeScript', 'Angular', 'JavaScript'],
  },
  {
    id: 4,
    title: 'Gerenciamento de Estado com NgRx',
    content:
      'NgRx é uma biblioteca para gerenciamento de estado em aplicações Angular. Aprenda os conceitos fundamentais e como implementar.',
    status: PostStatusEnum.DRAFT,
    authorId: 1,
    author: 'Administrador do Sistema',
    createdAt: '2025-09-09T11:20:00Z',
    tags: ['ngrx', 'angular', 'rxjs'],
  },
];
