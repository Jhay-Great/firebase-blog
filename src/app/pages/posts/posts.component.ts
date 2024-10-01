import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../shared/services/posts/posts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit{
  postForm!:FormGroup;
  errorMessage!:string;
  posts!:any[]

  constructor (
    private fb: FormBuilder,
    private postService: PostsService,
  ) {};

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: [''],
      body: ['', Validators.required],
    })
    // console.log(this.postService.createPost());
    // this.posts = this.postService.getAllPosts();

    // this.getPosts();
  }

  get title () {
    return this.postForm.get('title');
  }

  get body () {
    return this.postForm.get('body');
  }

  post () {
    const postData = this.postForm;
    if (postData.invalid) {
      console.log(postData.value);
      return ;
    }

    console.log('post data: ', postData.value);
    const data = postData.value;

    const response = this.postService.createPost(data);
    response.subscribe({
      next: value => {
        console.log(value);
      }, 
      error: error => {
        console.log('handling error: ', error);
        // handle it in the ui
        this.errorMessage = error;

      },
      complete: () => {
        console.log('done');
      }
    })
    
  };

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

  deletePost(id:string) {
    console.log(id);
    this.postService.deletePost(id).subscribe({
      next: value => {
        console.log('logging value: ', value);
      },
      error: error => {
        console.log('logging error: ', error);
      },
      complete: () => {
        console.log('done');
      }
    })
  }

}
