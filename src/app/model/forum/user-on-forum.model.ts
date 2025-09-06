import { Role } from '../users/role.model';
import { Forum } from './forum.model';
import { RegisteredUser } from '../users/registered-user.model';
import { Topic } from './topic.model';
import { Post } from './post.model';

export interface UserOnForum {
  id: number;
  role: Role;
  forum: Forum;
  registeredUser: RegisteredUser;
  topics: Topic[];
  posts: Post[];
}
