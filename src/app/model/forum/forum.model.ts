import { Topic } from './topic.model';

export interface Forum {
  id: number;
  javni: boolean;
  topics: Topic[];
}
