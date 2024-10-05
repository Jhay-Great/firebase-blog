import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, take } from 'rxjs';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';
import { Auth } from '@angular/fire/auth';
import { PostsService } from '../posts/posts.service';
import { CommentService } from '../comment/comment.service';
import { IComment } from '../../../core/models/post.interface';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private userSubject = new BehaviorSubject<any>([])
  private user$ = this.userSubject.asObservable();

  constructor(
    private firebase: FirebaseService,
    private postService: PostsService,
    private commentService: CommentService,
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

  getPostWithComments () {
    const comments = this.commentService.getAllComments();
    const posts = this.postService.getAllPosts();

    return combineLatest(([posts, comments])).pipe(
      map(([posts, comments]) => {
        return posts.map(post => ({
          ...post,
          comments:comments.filter(comment => comment['postId'] === post.id)
          // const id = post.id;
          // const postComment = comments.map((comment) => comment['postId'] === id )

          // console.log(id, postComment);
        }))
      })
    );
  }
}
