import { ITaskRepository } from '../repositories/task.reposiroty';
import { Task } from '../domains/task';

export class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

  async createTask(taskData: Task): Promise<Task> {
    return this.taskRepository.create(taskData);
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUserId(userId);
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    return this.taskRepository.update(taskId, updates);
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.taskRepository.delete(taskId);
  }
}