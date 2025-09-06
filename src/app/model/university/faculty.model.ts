import { Address } from "../address.model";
import { Teacher } from "../users/teacher.model";
import { University } from "./university.model";

export interface Faculty {
  id?: number;
  name?: string;
  dean?: Teacher;          
  university?: University; 
  addresses?: Address[];  
}
