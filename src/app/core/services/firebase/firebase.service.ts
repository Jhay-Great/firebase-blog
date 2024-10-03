import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, where } from '@angular/fire/firestore';
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

  document(docPath:string, id:string) {
    return doc(this.firestore, `${docPath}/${id}`);
  }

  create <T>(data:T, collectionName:string) {
    // const collections = collection(this.firestore, 'posts');
    const collections = this.documentCollection(collectionName);
    const userId = this.auth.currentUser?.uid;
    const userPost = {...data, userId};
    
    // const response = from(addDoc(collections, data));
    return from(addDoc(collections, userPost));
    
    
  };

  // get (collectionName:string) {
  //   const collections = this.documentCollection(collectionName);
  //   return from(collectionData(collections, { idField: 'id'}));
  // }

  getsAllRelated (collectionName:string, postId:string) {
    const collections = this.documentCollection(collectionName)
    const queryData = query(collections, where("postId", "==", postId))
    return collectionData(queryData, { idField: 'id' });
  }

  delete (docPath:string, id:string) {
    const docRef = this.document(docPath, id);
    return from(deleteDoc(docRef));
  }
}
