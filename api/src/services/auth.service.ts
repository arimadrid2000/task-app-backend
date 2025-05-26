import {IUserRepository} from "../repositories/user.repository";
import {User} from "../domains/user";
import * as jwt from "jsonwebtoken";

export interface DecodedTokenPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = "mi-secreto-super-seguro-para-desarrollo-local-987654321";

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async registerUser(userData: User): Promise<{ user: User; token: string } | null> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      return null;
    }


    const newUser = {...userData, createdAt: new Date()};
    const createdUser = await this.userRepository.create(newUser);

    if (createdUser) {
      const token = jwt.sign({id: createdUser.id || createdUser.email, email: createdUser.email}, JWT_SECRET, {expiresIn: "1h"});
      const {...userWithoutPassword} = createdUser;
      return {user: userWithoutPassword, token};
    }

    return null;
  }

  async loginUser(email: string): Promise<{ user: User; token: string } | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }


    const token = jwt.sign({id: user.id || user.email, email: user.email}, JWT_SECRET, {expiresIn: "1h"});
    const {...userWithoutPassword} = user;
    return {user: userWithoutPassword, token};
  }

  verifyToken(token: string): DecodedTokenPayload | null {
    try {
      const secret = process.env.JWT_SECRET || "your_default_secret_key_for_development";
      const decoded = jwt.verify(token, secret) as DecodedTokenPayload;
      return decoded;
    } catch (error) {
      console.error("Error al verificar el token:", error);
      return null;
    }
  }
}
