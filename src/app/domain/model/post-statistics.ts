export class PostStatistics {
  totalPosts!: number;
  publishedCount!: number;
  draftCount!: number;
  uniqueTagsCount!: number;
  uniqueTags!: string[];

  constructor(posts?: PostStatistics) {
    this.totalPosts = posts?.totalPosts ?? 0;
    this.publishedCount = posts?.publishedCount ?? 0;
    this.draftCount = posts?.draftCount ?? 0;
    this.uniqueTagsCount = posts?.uniqueTagsCount ?? 0;
    this.uniqueTags = posts?.uniqueTags ?? [];
  }
}
