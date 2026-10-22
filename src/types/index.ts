export interface Pet {
  id: string;
  name: string;
  species: string;
  age: number;
  createdAt: number;
}

export interface HistoryRecord {
  id: string;
  petId: string;
  description: string;
  date: string;
  reminderAt?: number | null;
  createdAt: number;
}
