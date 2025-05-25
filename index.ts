import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import serviceAccount from './config/serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes(db));
app.use('/api/users', userRoutes(db));
app.use('/api/tasks', taskRoutes(db));

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
