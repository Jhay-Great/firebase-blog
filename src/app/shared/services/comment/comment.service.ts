import { Injectable } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';
import { IComment } from '../../../core/models/post.interface';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { retryError } from '../../../core/rxjs/rety.custom-operator';

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
    const response = this.firebase.createPost(data, 'comments');
    response.pipe(retryError());
  }
}
