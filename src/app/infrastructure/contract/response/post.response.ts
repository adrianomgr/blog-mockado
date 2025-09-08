import { PostStatusEnum } from '@app/domain/enum/post-status.enum';
import { Post } from '@app/domain/model/post';
import { PostStatistics } from '@app/domain/model/post-statistics';

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

  static convertToStatistics(dados: PostResponse[]): PostStatistics {
    const statistics = new PostStatistics();
    statistics.totalPosts = dados.length;
    statistics.publishedCount = dados.filter((post) => post.status === 'published').length;
    statistics.draftCount = dados.filter((post) => post.status === 'draft').length;

    const allTags: string[] = [];
    dados.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        allTags.push(...post.tags);
      }
    });

    statistics.uniqueTags = [...new Set(allTags)].sort((a, b) => a.localeCompare(b));
    statistics.uniqueTagsCount = statistics.uniqueTags.length;

    return statistics;
  }
}
