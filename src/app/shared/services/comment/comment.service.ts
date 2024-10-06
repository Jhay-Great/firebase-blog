import { Injectable } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';
import { IComment } from '../../../core/models/post.interface';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { retryError } from '../../../core/rxjs/rety.custom-operator';
import { from, map } from 'rxjs';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {


  constructor(
    private firebase: FirebaseService,
    private firestore: Firestore, 
    private auth: Auth,
    private analyticsService: AnalyticsService,
  ) { }

  post (data:IComment) {
    const userId = this.auth.currentUser?.uid;
    const response = this.firebase.create(data, 'comments');
    response.pipe(retryError());
    this.analyticsService.trackComment(data.postId, data.userId);
  }

  getAllComments () {
    return from( this.firebase.get('comments')) ;
  }

  getComments (postId:string) {
    return this.firebase.getsAllRelated('comments', postId).pipe(
      map(data => data),
      retryError(),
    );
  }

  delete (id:string) {
    this.analyticsService.trackButtonClick('delete_comment');
    return this.firebase.delete('comments', id);
  }

  // getCommentsByPostId(postId: string): Observable<any[]> {
  //   const commentsRef = collection(this.firestore, 'comments');
  //   const q = query(commentsRef, where("postId", "==", postId));
  //   return collectionData(q, { idField: 'id' });
  // }
}
