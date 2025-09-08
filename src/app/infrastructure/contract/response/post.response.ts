import { PostStatusEnum } from '@app/domain/enum/post-status.enum';
import { Post } from '@app/domain/model/post';

export class PostResponse {
  id!: number;
  title!: string;
  content!: string;
  status!: PostStatusEnum;
  authorId!: number;
  author!: string;
  createdAt!: string;
  tags!: string[];

  static converter(dados: PostResponse[]): Post[] {
    return dados.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      status: item.status,
      authorId: item.authorId,
      author: item.author,
      createdAt: item.createdAt,
      tags: item.tags,
    }));
  }
}
