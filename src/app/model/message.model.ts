import { RegisteredUser } from './users/registered-user.model';
import { File } from './file.model';

export interface Message {
  id: number;
  dateSent: Date;
  content: string;
  sender: RegisteredUser;
  receiver: RegisteredUser;
  attachments?: File[];
}
