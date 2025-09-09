export class UserStatistics {
  totalUsers!: number;
  adminCount!: number;
  editorCount!: number;
  authorCount!: number;

  constructor(users?: UserStatistics) {
    this.totalUsers = users?.totalUsers ?? 0;
    this.adminCount = users?.adminCount ?? 0;
    this.editorCount = users?.editorCount ?? 0;
    this.authorCount = users?.authorCount ?? 0;
  }
}
