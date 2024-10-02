import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../shared/services/posts/posts.service';
import { IPost } from '../../core/models/post.interface';
import { PostModalComponent } from '../../shared/features/post-modal/post-modal.component';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../shared/services/comment/comment.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [PostModalComponent, ReactiveFormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit, OnDestroy{
  postId!:string;
  blogPost!:IPost;
  loading = false;
  errorMessage!:string; 
  private subscription!: Subscription;
  title!:string;
  body!:string;
  commentForm!:FormGroup;

  constructor (
    private activatedRoute: ActivatedRoute,
    private postService: PostsService,
    private fb: FormBuilder,
    private commentService: CommentService,
  ) {};

  ngOnInit(): void {
    this.subscription = this.activatedRoute.paramMap.subscribe(
      value => {
        const id = value.get('id');
        console.log(id);
        if (id) {
          this.postId = id;
          // this.isEdit = true;
          // console.log('editing...');
          this.postService.getAPost(id).subscribe({
            next: value => {
              console.log('logging: ', value);
              if (!value) return;
              this.blogPost = value;
              this.title = value.title;
              this.body = value.body;
            },
            error: error => {
              console.log(error);
            },
            complete: () => {
              console.log('done');
            }
          })
        }

      }
    )

    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get comment () {
    return this.commentForm.get('comment');
  }

  addComment () {
    const commentData = this.commentForm;
    if (commentData.invalid) {
      console.log('error occurred');
      return;
    }

    console.log(this.blogPost.id);
    const comment = commentData.value;
    const data = {postId: this.postId, ...comment };
    console.log(data);

    this.commentService.post(data);
    console.log('done posting comments');
    
  }



}
