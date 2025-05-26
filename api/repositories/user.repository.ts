import {Firestore} from "firebase-admin/firestore";
import {User} from "../domains/user";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
}

export class FirebaseUserRepository implements IUserRepository {
  constructor(private db: Firestore) {}

  async findByEmail(email: string): Promise<User | null> {
    console.log("Buscando usuario con email:", email);
    const usersRef = this.db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).limit(1).get();

    if (snapshot.empty) {
      console.log("No se encontró ningún usuario con ese email.");
      return null;
    }

    const userData = snapshot.docs[0].data();
    const userId = snapshot.docs[0].id;
    console.log("Usuario encontrado:", userId, userData);
    return {id: userId, ...userData} as User;
  }

  async create(user: User): Promise<User> {
    const userRef = this.db.collection("users").doc(user.email);
    await userRef.set(user);
    return {id: user.email, ...user};
  }
}
