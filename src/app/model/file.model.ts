import { Post } from './forum/post.model';
import { Notification } from './notification.model';
import { Message } from './message.model';
import { EvaluationInstrument } from './teaching/evaluation-instrument.model';
import { TeachingMaterial } from './teaching/teaching-material.model';


export interface File {
  id: number;
  description: string;
  url: string;
  post?: Post;
  notification?: Notification;
  message?: Message;
  evaluationInstruments?: EvaluationInstrument[];
  teachingMaterial?: TeachingMaterial;
}
