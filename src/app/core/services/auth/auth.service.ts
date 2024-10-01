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
import { catchError, from, map, Observable, of, retry, throwError } from 'rxjs';

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
  private token!:string | undefined;
  
  constructor(private auth: Auth) {}

  // login
  login(data: IUserData) {
    const { email, password } = data;
    const response = from(
      signInWithEmailAndPassword(this.auth, email, password)
    );

    // handles response
    return this.handleResponse(response);
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
    return this.handleResponse(response)
  }

  // sign in with google
  googleSignIn() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const response = from(signInWithPopup(auth, provider));

    // custom observable to handle provider response
    return this.handleProviderResponse(response);
  }

  // sets token
  updateToken (token:string | undefined) {
    this.token = token;
  }

  // retrieves token
  getToken () {
    return this.token;
  }

  // handle provider/google response
  handleProviderResponse (response: Observable<any>) {
    return response.pipe(map (response => {
      const client = GoogleAuthProvider.credentialFromResult(response);
      const token = client?.accessToken;
      this.updateToken(token); // not really needed
      return { client, token };
    }),
    retry(2),
    catchError(err => {
      const errorCode = err.code;
      const message = err.message;
      const clientError = GoogleAuthProvider.credentialFromError(err);
      console.log({clientError, message, errorCode})
      return throwError(() => err.message);
    })
  )
  }

  // custom rxjs operator for sign up and login // remove from here later
  handleResponse(response: Observable<any>) {
    return response.pipe(
      map((data) => {
        console.log('on success: ', data.user);
        const { email, metadata: {creationTime}, metadata} = data.user;
        console.log('logging metadata: ', metadata);
        console.log('logging user details: ', email, creationTime);
        return { email, creationTime };
      }),
      catchError((err) => {
        console.log('on error: ', err.message);
        return throwError(() => err.message);
      })
    );
  }
}
