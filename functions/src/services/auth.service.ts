import { IUserRepository } from '../repositories/user.repository';
import { User } from '../domains/user';
import * as jwt from 'jsonwebtoken';
// import * as functions from "firebase-functions"; 

// const JWT_SECRET = functions.config().jwt?.secret || 'super-secreto-para-desarrollo';
const JWT_SECRET = 'mi-secreto-super-seguro-para-desarrollo-local-987654321';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async registerUser(userData: User): Promise<{ user: User; token: string } | null> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      return null;
    }


    // const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const newUser = { ...userData, createdAt: new Date() };
    const createdUser = await this.userRepository.create(newUser);

     if (createdUser) {
        // Genera un token para el nuevo usuario también
        const token = jwt.sign({ id: createdUser.id || createdUser.email, email: createdUser.email }, JWT_SECRET, { expiresIn: '1h' });
        const { ...userWithoutPassword } = createdUser; // Si hay campo password, asegúrate de no devolverlo
        return { user: userWithoutPassword, token };
    }

    return null

    
  }

  async loginUser(email: string): Promise<{ user: User; token: string } | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }


    const token = jwt.sign({ id: user.id || user.email, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    const { ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  verifyToken(token: string): any {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (err) {
      return null;
    }
  }
}