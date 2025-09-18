export interface QuizOption {
  id?: number;
  text: string;
  correct?: boolean | null; 
  orderIndex?: number;
}
