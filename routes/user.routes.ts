import { Router } from 'express';
import { Firestore } from 'firebase-admin/firestore';

export default (db: Firestore) => {
  const router = Router();

  router.post('/', async (req, res) => {
  const { email } = req.body;
   try {
      const userRef = db.collection('users').doc(email); // Usa el email como ID
      const doc = await userRef.get();

      if (doc.exists) {
        res.status(400).json({ error: 'El usuario ya existe' });
        return;
      }

      await userRef.set({ email });
      res.status(201).json({ id: email }); // Retornamos el email como ID
    } catch (err) {
      console.error('🔥 Error al crear usuario:', err);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
});

  router.post('/login', async (req, res) => {
    const { email } = req.body;
    try {
      const userRef = db.collection('users').doc(email);
      const doc = await userRef.get();

      if (!doc.exists) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (err) {
      console.error('🔥 Error al iniciar sesión:', err);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  });

  return router;
};
