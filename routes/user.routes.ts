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
          const snapshot = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

        console.log('📦 Snapshot size:', snapshot.size);

        if (snapshot.empty) {
            console.log('⚠️ Usuario no encontrado para email:', email);
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const doc = snapshot.docs[0];
        console.log('✅ Usuario encontrado:', doc.id, doc.data());

        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (err) {
      console.error('🔥 Error al iniciar sesión:', err);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  });

  return router;
};
