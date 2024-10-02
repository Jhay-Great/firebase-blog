import { Injectable } from '@angular/core';
// import {AngularFirestore} from '@angular/fire/compat/firestore'
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, getDoc, updateDoc, } from '@angular/fire/firestore';
import { IPost } from '../../../core/models/post.interface';
import { catchError, from, map, Observable, retry, take, throwError } from 'rxjs';
import { retryError } from '../../../core/rxjs/rety.custom-operator';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  
  constructor(
    private firestore: Firestore,
    private auth: Auth,
  ) { }
   
  createPost (data:IPost) {
    const collections = collection(this.firestore, 'posts');
    const userId = this.auth.currentUser?.uid;
    const userPost = {...data, userId};
    
    // const response = from(addDoc(collections, data));
    const response = from(addDoc(collections, userPost));
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

//   getAPost(id: string): Observable<IPost> {
//   const postInstance = this.getDocInstance('posts', id);

//   return docData(postInstance, { idField: 'id' }).pipe(
//     map(data => {
//       if (!data) {
//         throw new Error('Document not found'); // Handle undefined case
//       }
//       return data as IPost; // Typecast to IPost
//     }),
//     retryError(3)
//     // retry(3), // Retry on error 3 times if needed
//     // catchError(error => {
//     //   console.error('Error fetching post:', error);
//     //   throw error; // Rethrow the error after handling/logging
//     // })
//   );
// }


  getAPost(id: string): Observable<IPost | null> {
    // const docRef = doc(this.firestore, 'posts', id);
    const postInstance = this.getDocInstance('posts', id);
    return from(getDoc(postInstance)).pipe(
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
