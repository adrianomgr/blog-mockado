import { NotificationTypeEnum } from '@app/domain/enum/notification-type.enum';
import { PostCreate } from './post-create';
import { UserCreate } from './user-create';

export class NovoNotification {
  type: NotificationTypeEnum;
  title: string;
  message: string;

  constructor(type: NotificationTypeEnum, data: PostCreate | UserCreate) {
    this.type = type;

    switch (type) {
      case NotificationTypeEnum.NEW_POST: {
        const post = data as PostCreate;
        this.title = 'Novo Post Criado';
        this.message = `O post "${post.title}" foi criado com sucesso!`;
        break;
      }

      case NotificationTypeEnum.NEW_USER: {
        const user = data as UserCreate;
        this.title = 'Novo Usuário Cadastrado';
        this.message = `O usuário "${user.name}" foi cadastrado com sucesso!`;
        break;
      }

      default:
        this.title = 'Nova Notificação';
        this.message = 'Uma nova notificação foi criada.';
    }
  }

  toCreateRequest() {
    return {
      type: this.type,
      title: this.title,
      message: this.message,
    };
  }
}
