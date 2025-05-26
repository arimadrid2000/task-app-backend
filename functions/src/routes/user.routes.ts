import { Router } from 'express';
import { AuthService } from '../services/auth.service';

export default (authService: AuthService) => {
  const router = Router();


  router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
      const result = await authService.registerUser({ email });
       if (!result) { 
    res.status(400).json({ error: 'El usuario ya existe' });
    return;
   }
      res.status(201).json({
            id: result.user.email, 
            message: 'Usuario registrado exitosamente',
            token: result.token 
        });
  } catch (err) {
   console.error('🔥 Error al registrar usuario:', err);
   res.status(500).json({ error: 'Error al registrar usuario' });
  }
  });


  router.post('/login', async (req, res) => {
    const { email } = req.body;
    try {
      const result = await authService.loginUser(email);
      if (!result) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }
      res.status(200).json({ user: result.user, token: result.token });
    } catch (err) {
      console.error('🔥 Error al iniciar sesión:', err);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  });

  return router;
};