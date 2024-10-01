import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, Auth, signOut, User, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { catchError, from, map, Observable, of } from 'rxjs';

// local imports
import { ILogOut, ILogin, ISignIn, IUserData } from '../../models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements ILogOut, ILogin {

  constructor(
    private auth: Auth,
  ) { }

  // login
  login(data:IUserData) {
    const { email, password } = data;
    const response = from(signInWithEmailAndPassword(this.auth, email, password));
    this.handleResponse(response).subscribe();
  }

  // sign up
  logout () {
    signOut(this.auth);
  }
  
  // register / sign up
  signup (data:IUserData) {
    const response = from(createUserWithEmailAndPassword(this.auth, data.email, data.password));

    // response
    this.handleResponse(response).subscribe();
  }

  // custom rxjs operator // remove from here later
  handleResponse (response:Observable<any>) {
    return response.pipe(
      map(data => {
        console.log('on success: ', data);
        return data;
      }),
      catchError(err => {
        console.log('on error: ', err.message);
        return of('login failed');
      })
    )
  }
}
