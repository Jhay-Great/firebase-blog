import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../shared/services/posts/posts.service';
import { Observable } from 'rxjs';
import { IPost } from '../../core/models/post.interface';
import { PostComponent } from '../../shared/features/post/post.component';
import { RouterLink } from '@angular/router';

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

  constructor (
    private postService: PostsService,
  ) {};

  ngOnInit(): void {
    // this.postForm = this.fb.group({
    //   title: [''],
    //   body: ['', Validators.required],
    // })
    // console.log(this.postService.createPost());
    // this.posts = this.postService.getAllPosts();

  }
  
  ngAfterViewInit(): void {
    this.getPosts();
    
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
