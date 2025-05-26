import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';

import userRoutes from './routes/user.routes';
import taskRoutes, { authenticateToken } from './routes/task.routes';

import { FirebaseUserRepository } from './repositories/user.repository';
import { FirebaseTaskRepository } from './repositories/task.reposiroty';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';

if (admin.apps.length === 0) {


  const serviceAccount = require('../../config/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

const userRepository = new FirebaseUserRepository(db);
const taskRepository = new FirebaseTaskRepository(db);

const authService = new AuthService(userRepository);
const taskService = new TaskService(taskRepository);

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/auth', userRoutes(authService));

app.use('/tasks', authenticateToken(authService), taskRoutes(taskService));

exports.api = functions.https.onRequest(app);
