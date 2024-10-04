import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';
import { Auth } from '@angular/fire/auth';
import { PostsService } from '../posts/posts.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private userSubject = new BehaviorSubject<any>([])
  private user$ = this.userSubject.asObservable();

  constructor(
    private firebase: FirebaseService,
    private postService: PostsService,
    private auth: Auth,
  ) { }

  setUser (data:any) {
    this.userSubject.next(data);
  }

  getUser () {
    return this.user$;
  }

  checkAuthorPrivileges (postId:string) {
    const currentUserId = this.firebase.getCurrentUser()?.uid;
    return currentUserId === postId;
    // const posts = this.postService.getAllPosts();
    // return posts.pipe(
    //   take(1),
    //   map(data => {
    //     return data.map(post => ( post.id === currentUserId))
    //   })
    // );
    // return this.auth.currentUser;

  }
}
