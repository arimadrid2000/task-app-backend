export interface Task {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pendiente' | 'completada';
  createdAt?: Date;
}