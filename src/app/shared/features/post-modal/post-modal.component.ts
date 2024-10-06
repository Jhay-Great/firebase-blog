import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts/posts.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-modal',
  standalone: true,
  imports: [ReactiveFormsModule,],
  templateUrl: './post-modal.component.html',
  styleUrl: './post-modal.component.scss',
})
export class PostModalComponent implements OnInit, OnDestroy {
  postForm!: FormGroup;
  errorMessage!: string;
  subscription!: Subscription;
  isEdit:boolean = false;
  postId!:string;
  // posts!: any[];

  constructor(
    private fb: FormBuilder, 
    private postService: PostsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: [''],
      body: ['', Validators.required],
    });

    this.activatedRoute.paramMap.subscribe(
      value => {
        const id = value.get('id');
        console.log(id);
        if (id) {
          this.postId = id;
          this.isEdit = true;
          console.log('editing...');
          this.postService.getAPost(id).subscribe({
            next: value => {
              console.log(value);

              this.postForm.patchValue({
                title: value?.title,
                body: value?.body,
              })
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

    

    // this.getPosts();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get title() {
    return this.postForm.get('title');
  }

  get body() {
    return this.postForm.get('body');
  }

  post() {
    const postData = this.postForm;
    if (postData.invalid) {
      console.log(postData.value);
      return;
    }

    console.log('post data: ', postData.value);
    const data = postData.value;

    const response = this.postService.createPost(data);
    this.subscription = response.subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (error) => {
        console.log('handling error: ', error);
        // handle it in the ui
        this.errorMessage = error;
      },
      complete: () => {
        console.log('done');
        this.router.navigate(['blog-posts']);
      },
    });
  }

  update () {
    const postData = this.postForm;
    if (postData.invalid) {
      console.log(postData.value);
      return;
    }

    const data = postData.value;
    this.postService.updatePost(this.postId, data).subscribe({
      next: value => {
        console.log(value);
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        console.log('done');
        this.router.navigate(['blog-posts']);
      },
    })
    
  }


}
