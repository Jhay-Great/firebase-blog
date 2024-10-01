import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  Auth,
  signOut,
  User,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from '@angular/fire/auth';
import { catchError, from, map, Observable, of, retry } from 'rxjs';

// local imports
import {
  ILogOut,
  ILogin,
  ISignIn,
  IUserData,
} from '../../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements ILogOut, ILogin {
  constructor(private auth: Auth) {}

  // login
  login(data: IUserData) {
    const { email, password } = data;
    const response = from(
      signInWithEmailAndPassword(this.auth, email, password)
    );

    // handles response
    this.handleResponse(response).subscribe();
  }

  // sign up
  logout() {
    signOut(this.auth);
  }

  // register / sign up
  signup(data: IUserData) {
    const response = from(
      createUserWithEmailAndPassword(this.auth, data.email, data.password)
    );

    // handles response
    this.handleResponse(response).subscribe();
  }

  // sign in with google
  googleSignIn() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const response = from(signInWithPopup(auth, provider));

    // custom observable to handle provider response
    return this.handleProviderResponse(response);
  }

  // handle provider/google response
  handleProviderResponse (response: Observable<any>) {
    response.pipe(map (response => {
      const client = GoogleAuthProvider.credentialFromResult(response);
      const token = client?.accessToken;
      return { client, token };
    }),
    retry(2),
    catchError(err => {
      const errorCode = err.code;
      const message = err.message;
      const clientError = GoogleAuthProvider.credentialFromError(err);
      console.log({clientError, message, errorCode})
      return message;
    })
  )
  }

  // custom rxjs operator // remove from here later
  handleResponse(response: Observable<any>) {
    return response.pipe(
      map((data) => {
        console.log('on success: ', data);
        return data;
      }),
      catchError((err) => {
        console.log('on error: ', err.message);
        return of('login failed');
      })
    );
  }
}
