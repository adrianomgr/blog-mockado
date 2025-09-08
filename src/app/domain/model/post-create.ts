import { PostStatusEnum } from '@app/domain/enum/post-status.enum';

export class PostCreate {
  title!: string;
  content!: string;
  status!: PostStatusEnum;
  tags!: string[];

  constructor(dados: PostCreate) {
    this.title = dados.title;
    this.content = dados.content;
    this.status = dados.status;
    this.tags = dados.tags;
  }
}
