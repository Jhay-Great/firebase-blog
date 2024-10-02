import { Injectable } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';
import { IComment } from '../../../core/models/post.interface';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { retryError } from '../../../core/rxjs/rety.custom-operator';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {


  constructor(
    private firebase: FirebaseService,
    private firestore: Firestore, 
    private auth: Auth,
  ) { }

  post (data:IComment) {
    const userId = this.auth.currentUser?.uid;
    const response = this.firebase.create(data, 'comments');
    response.pipe(retryError());
  }

  getComments (postId:string) {
    return this.firebase.getsAllRelated('comments', postId).pipe(
      map(data => data),
      retryError(),
    );
  }

  // getCommentsByPostId(postId: string): Observable<any[]> {
  //   const commentsRef = collection(this.firestore, 'comments');
  //   const q = query(commentsRef, where("postId", "==", postId));
  //   return collectionData(q, { idField: 'id' });
  // }
}
