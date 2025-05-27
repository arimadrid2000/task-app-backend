import express from "express";
import cors from "cors";
import * as admin from "firebase-admin"; 
import userRoutes from "./routes/user.routes";
import taskRoutes, { authenticateToken } from "./routes/task.routes";
import { FirebaseUserRepository } from "./repositories/user.repository";
import { FirebaseTaskRepository } from "./repositories/task.reposiroty"; 
import { AuthService } from "./services/auth.service";
import { TaskService } from "./services/task.service";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../.env' }); 
}

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin SDK inicializado correctamente.");
  }
} else {
  console.warn("Firebase Admin SDK NO inicializado. Verifique las variables de entorno.");
}

const db = admin.firestore();
const userRepository = new FirebaseUserRepository(db);
const taskRepository = new FirebaseTaskRepository(db);
const authService = new AuthService(userRepository);
const taskService = new TaskService(taskRepository);

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use("/auth", userRoutes(authService));
app.use("/tasks", authenticateToken(authService), taskRoutes(taskService, authService));


app.get('/api/status', (req, res) => {
  res.status(200).json({ message: 'Backend is running on Vercel!', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend Express listening on port ${PORT}`);
});


module.exports = app;