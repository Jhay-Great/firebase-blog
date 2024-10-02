import { Injectable } from '@angular/core';
// import {AngularFirestore} from '@angular/fire/compat/firestore'
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, updateDoc, } from '@angular/fire/firestore';
import { IPost } from '../../../core/models/post.interface';
import { catchError, from, map, Observable, retry, take, throwError } from 'rxjs';
import { retryError } from '../../../core/rxjs/rety.custom-operator';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  
  constructor(
    private firestore: Firestore,
  ) { }
   
  createPost (data:IPost) {
    const collections = collection(this.firestore, 'posts');
    
    const response = from(addDoc(collections, data));
    return response.pipe(
      take(1),
      map((data) => {
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
      map((data: any[]) => (console.log('data: ', data), data )),
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

  // gets a post
  // getAPost (id:string)  {
  //   const postInstance = this.getDocInstance('posts', id);
  //   return from(getDoc(postInstance)).pipe(
  //     map(data => {
  //       console.log(data);
  //     }),
  //     retryError(3)
  //   );

  // }

  getAPost(id: string): Observable<IPost | null> {
    const docRef = doc(this.firestore, 'posts', id);
    return from(getDoc(docRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as IPost;
        } else {
          return null;
        }
      }),
      retryError(3)
    );
  }

  updatePost (id:string, data:any) {
    const docInstance = doc(this.firestore, `posts/${id}`);
    return from(updateDoc(docInstance, data));
  };

  // update<T>(path: string, id: string, data: Partial<T>): Promise<void> {
  //   const docInstance = doc(this.firestore, `${path}/${id}`);
  //   return updateDoc(docInstance, data);
  // }

  deletePost (id:string) {
    // const postInstance = doc(this.firestore, `posts/${id}`);
    const postInstance = this.getDocInstance('posts', id);
    console.log('logging post ref: ', postInstance);
    return from(deleteDoc(postInstance));
  }

  // returns the specified column in the db
  getDocInstance (path:string, id:string='') {
    return doc(this.firestore, `${path}/${id}`);
  }
}
