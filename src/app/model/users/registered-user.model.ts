import { UserOnForum } from '../forum/user-on-forum.model';
import { User } from './user.model';


export interface RegisteredUser extends User {
  userOnForums: UserOnForum[];
}
