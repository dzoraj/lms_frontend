import { RegisteredUser } from './registered-user.model';

export interface Administrator extends RegisteredUser {
  accessLevel: string;
}
