import { Injectable } from '@angular/core';
// import {AngularFirestore} from '@angular/fire/compat/firestore'
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, } from '@angular/fire/firestore';
import { IPost } from '../../../core/models/post.interface';
import { catchError, from, map, Observable, retry, take, throwError } from 'rxjs';
import { retryError } from '../../../core/rxjs/rety.custom-operator';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  
  constructor(
    // private firebase: AngularFirestore,
    private firestore: Firestore,
  ) { 
    // console.log(this.collection);
   }
   
  //  getAll<T>(path: string): Observable<T[]> {
  //   const collectionInstance = collection(this.firestore, 'posts');
  //   return collectionData(collectionInstance) as Observable<T[]>;
  // }
  
  createPost (data:any) {
    const collections = collection(this.firestore, 'posts');

    // addDoc(collections, data).then(() => {
    //   console.log('someting')
    // }).catch(() => {
    //   console.log('error');
    // })

    const response = from(addDoc(collections, data));
    return response.pipe(
      take(1),
      map(data => {
        console.log('data: ', data);
        return 'blog posted successfully';
      }),
      retry(3),
      catchError(error => {
        console.log(error);
        return throwError(() => error.message);
      })
    )
    
  };

  getAllPosts () {

    const postCollection = collection(this.firestore, 'posts');
    return collectionData(postCollection, { idField: 'id' }).pipe(
      map((data: any[]) => data ),
      retryError(3)
    );
    
    
    // const postCollection = collection(this.firestore, 'posts');
    // const response = collectionData(postCollection) as Observable<any>;
    // return response.pipe(
    //   map(data => {
    //     console.log(data);
    //     return data;
    //   }),
    //   retryError(),
    //   // retry(3),
    //   // catchError(error => {
    //   //   console.log(error);
    //   //   return throwError(() => error.message);
    //   // })
    // )

    // getDoc(postCollection),
  };

  updatePost () {};

  deletePost (id:string) {
    const postInstance = doc(this.firestore, `posts/${id}`)
    console.log('logging post ref: ', postInstance);
    return from(deleteDoc(postInstance));
  }
}
