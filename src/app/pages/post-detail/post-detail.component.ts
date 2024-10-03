import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../shared/services/posts/posts.service';
import { IComment, IPost } from '../../core/models/post.interface';
import { PostModalComponent } from '../../shared/features/post-modal/post-modal.component';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../shared/services/comment/comment.service';
import { Meta, Title } from '@angular/platform-browser';

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
  commentsData!:IComment[];

  constructor (
    private activatedRoute: ActivatedRoute,
    private postService: PostsService,
    private fb: FormBuilder,
    private commentService: CommentService, 
    private titleService: Title,
    private metaService: Meta
  ) {
    // sets dynamic title for page
    this.titleService.setTitle(`Blog Post | ${this.title}`);
    
    // sets dynamic meta tags
    this.metaService.updateTag({name: 'keywords', content: 'post, posts, blog, blogs, write up, facts, story, stories'})
    this.metaService.updateTag({name: 'description', content: 'A detailed page about a specific topic. Enjoy captivating short stories, facts, wild sayings from some of your favorite authors and community leaders'})
  };

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

    // initializes form 
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    })

    // gets comments
    this.getPostComments();
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

  // gets posts comments
  getPostComments () {
    this.loading = true;
    console.log('getting comments...')
    const response = this.commentService.getComments(this.postId);
    response.subscribe({
      next: (value) => {
        this.loading = false;
        this.commentsData = value as IComment[];
        console.log(this.commentsData);
      },
      error: error => {
        console.log('logging error: ', error);
        // handle error
      },
      complete: () => {
        console.log('done');
        // of loader
      }
    })
  }

  deleteComment (id:string) {
    this.commentService.delete(id)
  }



}
