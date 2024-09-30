import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, Auth, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
  ) { }

  // login
  login(data:{email:string, password:string}) {
    const { email, password } = data;
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // sign up
  logOut () {
    signOut(this.auth);
  }

  // forgotten password
}
