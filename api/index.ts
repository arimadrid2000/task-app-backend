import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import * as admin from "firebase-admin";

import userRoutes from "./routes/user.routes";
import taskRoutes, {authenticateToken} from "./routes/task.routes";

import {FirebaseUserRepository} from "./repositories/user.repository";
import {FirebaseTaskRepository} from "./repositories/task.reposiroty";
import {AuthService} from "./services/auth.service";
import {TaskService} from "./services/task.service";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../.env' });
}

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,

  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin SDK inicializado correctamente.");
} else {
  console.warn("Firebase Admin SDK NO inicializado. Verifique las variables de entorno.");
}

const db = admin.firestore();

const userRepository = new FirebaseUserRepository(db);
const taskRepository = new FirebaseTaskRepository(db);

const authService = new AuthService(userRepository);
const taskService = new TaskService(taskRepository);

const app = express();

app.use(cors({origin: true}));
app.use(express.json());

app.use("/auth", userRoutes(authService));

app.use("/tasks", authenticateToken(authService), taskRoutes(taskService, authService));

exports.api = functions.https.onRequest(app);
