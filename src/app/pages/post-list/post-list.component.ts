import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../shared/services/posts/posts.service';
import { Observable } from 'rxjs';
import { IPost, IPostWithComments } from '../../core/models/post.interface';
import { PostComponent } from '../../shared/features/post/post.component';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ApplicationService } from '../../shared/services/app/application.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PostComponent, ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, AfterViewInit{
  // postForm!:FormGroup;
  // errorMessage!:string;
  posts!:any[];
  data!:IPostWithComments[];
  commentsCount:number = 0;
  isAuthor!:boolean;

  constructor (
    private postService: PostsService,
    private applicationService: ApplicationService,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private titleService: Title,
    private metaService: Meta,
  ) {
    // sets dynamic page title
    this.titleService.setTitle('Blog Post | Captivating Stories and Facts');

    // sets dynamic meta tag for login page
    this.metaService.updateTag({name: 'keywords', content: 'blog post, blogs, blog, write up, posts, post'})
    this.metaService.updateTag({
      name: 'description', 
      content: 'Discover engaging blog posts with short stories, facts, and wild sayings from your favorite authors and community leaders. Dive into captivating content that inspires and informs.'
    });
    
  }

  ngOnInit(): void {
    this.analyticsService.trackPageView('blog_post_list');
    // this.postForm = this.fb.group({
    //   title: [''],
    //   body: ['', Validators.required],
    // })
    // console.log(this.postService.createPost());
    // this.posts = this.postService.getAllPosts();

    // this.authorPrivileges();

  }
  
  ngAfterViewInit(): void {
    this.getPosts();
    this.getData();
    

    // unique
    this.applicationService.getUserInitial();
    
  }
  
  getPosts () {
    this.postService.getAllPosts().subscribe({
      next: value => {
        this.posts = value;
        console.log(value);
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        console.log('done');
      }
    })
  }


  authorPrivileges (id:string) {
    // console.log('prints id: ', id);
    this.applicationService.checkAuthorPrivileges(id);
    
    
  }

  getData () {
      this.applicationService.getPostWithComments().subscribe({
      next: value => {
        this.data = value;
        console.log('logging post with comments: ', value);
      },
    });
  }


  // deletePost(id:string) {
  //   console.log(id);
  //   this.postService.deletePost(id).subscribe({
  //     next: value => {
  //       console.log('logging value: ', value);
  //     },
  //     error: error => {
  //       console.log('logging error: ', error);
  //     },
  //     complete: () => {
  //       console.log('done');
  //     }
  //   })
  // }

}
