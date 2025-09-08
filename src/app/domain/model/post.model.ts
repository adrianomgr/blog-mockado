import { PostStatusEnum } from '../enum/post-status.enum';

export class PostModel {
  id: number;
  title: string;
  content: string;
  status: PostStatusEnum;
  authorId: number;
  author: string;
  createdAt: string;
  tags: string[];

  constructor(dados: PostModel) {
    this.id = dados.id;
    this.title = dados.title;
    this.content = dados.content;
    this.status = dados.status;
    this.authorId = dados.authorId;
    this.author = dados.author;
    this.createdAt = dados.createdAt;
    this.tags = dados.tags;
  }
}
