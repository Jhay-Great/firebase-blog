import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, Auth, signOut } from '@angular/fire/auth';
import { ILogOut, ILogin, ISignOut, ISignIn } from '../../models/auth.interface';
import { catchError, from, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements ILogOut, ILogin {

  constructor(
    private auth: Auth,
  ) { }

  // login
  login(data:{email:string, password:string}) {
    const { email, password } = data;
    const response = from(signInWithEmailAndPassword(this.auth, email, password));
    console.log('logging response: ', response);
    response.pipe(
      map(data => {
        console.log(data);
        return 'login successful';
      }),
      catchError(err => {
        console.log(err.message);
        return of('login failed');
      })
    ).subscribe();
  }

  // sign up
  logout () {
    signOut(this.auth);
  }

  // forgotten password
}
