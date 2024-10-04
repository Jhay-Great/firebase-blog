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
import { catchError, from, map, Observable, of, retry, take, tap, throwError } from 'rxjs';

// local imports
import {
  ILogOut,
  ILogin,
  ISignIn,
  IUserData,
} from '../../models/auth.interface';
import { addDoc, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { ApplicationService } from '../../../shared/services/app/application.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements ILogOut, ILogin {
  private token!:string | undefined;
  
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private firebaseService: FirebaseService,
    private applicationService: ApplicationService,
  ) {}

  // authentication details
  getUserDetails (postUserId:string) {
    const currentUserId = this.auth.currentUser?.uid;
    return currentUserId === postUserId;

  }

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
    console.log('triggered');
    from(signOut(this.auth));
  }

  // register / sign up
  signup(data: IUserData) {
    const response = from(
      createUserWithEmailAndPassword(this.auth, data.email, data.password)
    );
    const { username } = data;
    console.log('logging data: ', username)

    // handles response
    return this.handleResponse(response, username)
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
  handleResponse(response: Observable<any>, username:string='') {
    return response.pipe(
      map((data) => {
        console.log('on success: ', data.user);
        const { email, uid, metadata: {creationTime, lastSignInTime}, metadata} = data.user;

        // console.log('logging metadata: ', metadata);
        // console.log('logging user details: ', email, creationTime);
        return { email, creationTime, uid, username, lastSignInTime };
      }),
      tap(data => {
        console.log('logging data in tap: ', data); 
        console.log('is username truthy: ', data.username);
        // create a new user in the db
        // console.log('logging username: ', data.username);
        
        
        if (!data.username) {
          console.log('when username is falsy');
          // this means we are logging in, so we fetch from the db
          // const userCollection = this.firebaseService.document('users', data.uid);
          console.log(data.uid);
          const userCollection = doc(this.firestore, 'users', data.uid);
          console.log('logging user collection data: ', userCollection);

          const response = from(getDoc(userCollection)).pipe(
            take(1),
            map(userData => {
              console.log('in map: ', userData)
              if (userData.exists()) {

                const data = userData.data();
                console.log('logging data gotten from db: ', data);
                this.applicationService.setUser(data); // gets user data
              } else {
                console.log('does not exists');
              }

            })
          ).subscribe(); 
          return;
        };
        // const usersCollections = this.firebaseService.documentCollection('users'); // get the user collections
        const usersCollections = doc(this.firestore, 'users', data.uid);
        console.log('logging data: ', data);
        const response = from(setDoc(usersCollections, data));
        response.subscribe(val => console.log('logging user collection: ', val));



      }),
      catchError((err) => {
        console.log('on error: ', err.message);
        return throwError(() => err.message);
      })
    );
  }
}
