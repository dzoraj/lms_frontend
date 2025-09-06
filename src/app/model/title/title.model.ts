import { Teacher } from '../users/teacher.model';               
import { ScientificField } from './scientific-field.model';
import { TitleType } from './title-type.model';

export interface Title {
  id?: number;
  selectionDate?: string;    
  endDate?: string;          
  teacher?: Teacher;         
  scientificFields?: ScientificField[];  
  titleTypes?: TitleType[];             
}
