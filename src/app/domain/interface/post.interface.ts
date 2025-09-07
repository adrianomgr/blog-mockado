export interface Post {
  id: number;
  title: string;
  content: string;
  status: 'published' | 'draft';
  authorId: number;
  author: string;
  createdAt: string;
  tags: string[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  status: 'published' | 'draft';
  authorId: number;
  author: string;
  tags: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  status?: 'published' | 'draft';
  authorId?: number;
  author?: string;
  tags?: string[];
}
