import {Router, Request, Response, NextFunction} from "express";
import {TaskService} from "../services/task.service";
import {AuthService} from "../services/auth.service";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; email: string };
  }
}

export const authenticateToken = (authService: AuthService) => (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).json({message: "No autorizado: Token no proporcionado"});
    return;
  }

  const decoded = authService.verifyToken(token);
  if (!decoded) {
    res.status(403).json({message: "No autorizado: Token inválido o expirado"});
    return;
  }

  req.user = decoded;
  next();
};


export default (taskService: TaskService) => {
  const router = Router();


  router.post("/", async (req, res) => {
    if (!req.user || !req.user.id) {
      res.status(401).json({error: "Usuario no autenticado para crear tarea."});
      return;
    }
    const {title, description, status} = req.body;
    const userId = req.user.id;

    console.log("✅ Payload recibido:", req.body);

    try {
      const newTask = await taskService.createTask({userId, title, description, status: status || "pending"});
      res.status(201).json({id: newTask.id});
    } catch (err) {
      console.error("Error al crear tarea:", err);
      res.status(500).json({error: "Error al crear tarea", resp: err});
    }
  });


  router.get("/", async (req, res) => {
    if (!req.user || !req.user.id) {
      res.status(401).json({error: "Usuario no autenticado para obtener tareas."});
      return;
    }
    const userId = req.user.id;

    try {
      const tasks = await taskService.getTasksByUserId(userId);
      res.json(tasks);
    } catch (err) {
      console.error("Error al obtener tareas:", err);
      res.status(500).json({error: "Error al obtener tareas"});
    }
  });

  router.get("/:userId", async (req, res) => {
    const userIdFromUrl = req.params.userId;

    if (!req.user || !req.user.id) {
      res.status(401).json({error: "Usuario no autenticado para obtener tareas."});
      return;
    }

    try {
      const tasks = await taskService.getTasksByUserId(userIdFromUrl);
      res.json(tasks);
    } catch (err) {
      console.error("🔥 Error al obtener tareas por ID de usuario desde URL:", err);
      res.status(500).json({error: "Error al obtener tareas."});
    }
  });


  router.put("/:taskId", async (req, res) => {
    if (!req.user || !req.user.id) {
      res.status(401).json({error: "Usuario no autenticado para actualizar tarea."});
      return;
    }
    const {title, description, status} = req.body;

    try {
      await taskService.updateTask(req.params.taskId, {title, description, status});
      res.json({message: "Tarea actualizada"});
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      res.status(500).json({error: "Error al actualizar tarea"});
    }
  });


  router.delete("/:taskId", async (req, res) => {
    if (!req.user || !req.user.id) {
      res.status(401).json({error: "Usuario no autenticado para eliminar tarea."});
      return;
    }
    try {
      await taskService.deleteTask(req.params.taskId);
      res.json({message: "Tarea eliminada"});
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      res.status(500).json({error: "Error al eliminar tarea"});
    }
  });

  return router;
};
