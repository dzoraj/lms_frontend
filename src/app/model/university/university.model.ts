import { Address } from '../address.model';
import { Faculty } from './faculty.model';

export interface University {
  id?: number;
  name?: string;
  establishmentDate?: string;  
  faculties?: Faculty[];       
  addresses?: Address[];      
}
