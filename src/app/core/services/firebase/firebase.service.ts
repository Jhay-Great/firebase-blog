import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { from, take, map, retry, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  documentCollection (collectionName:string) {
    return collection(this.firestore, collectionName);
  }

  createPost <T>(data:T, collectionName:string) {
    // const collections = collection(this.firestore, 'posts');
    const collections = this.documentCollection(collectionName);
    const userId = this.auth.currentUser?.uid;
    const userPost = {...data, userId};
    
    // const response = from(addDoc(collections, data));
    return from(addDoc(collections, userPost));

    // return response.pipe(
    //   take(1),
    //   map((data) => {
    //     console.log('data: ', data);
    //     return 'blog posted successfully';
    //   }),
    //   retry(3),
    //   catchError(error => {
    //     console.log(error);
    //     return throwError(() => error.message);
    //   })
    // )
    
  };
}
