import { Firestore } from 'firebase-admin/firestore';
import { Task } from '../domains/task'; 


export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findByUserId(userId: string): Promise<Task[]>;
  update(taskId: string, updates: Partial<Task>): Promise<void>;
  delete(taskId: string): Promise<void>;
}


export class FirebaseTaskRepository implements ITaskRepository {
  constructor(private db: Firestore) {}

  async create(task: Task): Promise<Task> {
    const taskRef = await this.db.collection('tasks').add({
      ...task,
      createdAt: new Date()
    });
    return { id: taskRef.id, ...task };
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const snapshot = await this.db
      .collection('tasks')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
  }

  async update(taskId: string, updates: Partial<Task>): Promise<void> {
    await this.db.collection('tasks').doc(taskId).update(updates);
  }

  async delete(taskId: string): Promise<void> {
    await this.db.collection('tasks').doc(taskId).delete();
  }
}