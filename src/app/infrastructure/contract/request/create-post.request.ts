import { PostStatusEnum } from '@app/domain/enum/post-status.enum';

export class CreatePostRequest {
  title!: string;
  content!: string;
  status!: PostStatusEnum;
  authorId!: number;
  author!: string;
  tags!: string[];

  constructor(dados: CreatePostRequest) {
    this.title = dados.title;
    this.content = dados.content;
    this.status = dados.status;
    this.authorId = dados.authorId;
    this.author = dados.author;
    this.tags = dados.tags;
  }
}
