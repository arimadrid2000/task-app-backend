import { Router } from 'express';
import { Firestore } from 'firebase-admin/firestore';

export default (db: Firestore) => {
  const router = Router();

  // Crear tarea
  router.post('/', async (req, res) => {
    const { userId, title, description, status } = req.body;

    console.log('✅ Payload recibido:', req.body);

    try {
      const taskRef = await db.collection('tasks').add({
        userId,
        title,
        description,
        status: status || 'pending',
        createdAt: new Date()
      });
      res.status(201).json({ id: taskRef.id });
    } catch (err) {
      console.error('Error al crear tarea:', err);
      res.status(201).json({ error: 'Error al crear tarea', resp: err });
    }
  });

  // Obtener tareas de un usuario
  router.get('/:userId', async (req, res) => {
    try {
      const snapshot = await db
        .collection('tasks')
        .where('userId', '==', req.params.userId)
        .orderBy('createdAt', 'desc')
        .get();

      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(tasks);
    } catch (err) {
      console.error('Error al obtener tareas:', err);
      res.status(500).json({ error: 'Error al obtener tareas' });
    }
  });

  // Actualizar tarea
  router.put('/:taskId', async (req, res) => {
    const { title, description, status } = req.body;

    try {
      await db.collection('tasks').doc(req.params.taskId).update({
        title,
        description,
        status
      });
      res.json({ message: 'Tarea actualizada' });
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
      res.status(500).json({ error: 'Error al actualizar tarea' });
    }
  });

  // Eliminar tarea
  router.delete('/:taskId', async (req, res) => {
    try {
      await db.collection('tasks').doc(req.params.taskId).delete();
      res.json({ message: 'Tarea eliminada' });
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      res.status(500).json({ error: 'Error al eliminar tarea' });
    }
  });

  return router;
};
