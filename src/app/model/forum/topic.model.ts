import { UserOnForum } from './user-on-forum.model';
import { Post } from './post.model';
import { Forum } from './forum.model';

export interface Topic {
  id: number;
  name: string;
  author: UserOnForum;
  posts: Post[];
  forum: Forum;
}
