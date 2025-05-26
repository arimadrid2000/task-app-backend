import {Firestore, Timestamp} from "firebase-admin/firestore";
import {User} from "../domains/user";
import { v4 as uuidv4 } from 'uuid';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
}

export class FirebaseUserRepository implements IUserRepository {
  constructor(private db: Firestore) {}

  async findByEmail(email: string): Promise<User | null> {
    const usersRef = this.db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).limit(1).get();

    if (snapshot.empty) {
      console.log("No se encontró ningún usuario con ese email.");
      return null;
    }

    const userData = snapshot.docs[0].data();
    const userId = snapshot.docs[0].id;

    if (userData.createdAt instanceof Timestamp) {
      userData.createdAt = userData.createdAt.toDate();
    }

    const { hashedPassword, ...userWithoutHash } = userData;
    return {id: userId, ...userWithoutHash} as User;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const newUserId = uuidv4();
    const newUserWithId: User = {id: newUserId, ...user, createdAt: new Date()};

    console.log(newUserWithId);
    const userRef = this.db.collection("users").doc(newUserId);
    await userRef.set(newUserWithId);

    const { ...userWithoutHash } = newUserWithId;
    return userWithoutHash as User;
  }
}