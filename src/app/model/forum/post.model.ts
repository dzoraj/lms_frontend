import { UserOnForum } from './user-on-forum.model';
import { Topic } from './topic.model';
import { File } from '../file.model';

export interface Post {
  id: number;
  postingTime: string; // ISO date string (e.g., "2025-06-09")
  content: string;
  author: UserOnForum;
  topic: Topic;
  attachments: File[];
}
