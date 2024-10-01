import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit{
  postForm!:FormGroup;

  constructor (
    private fb: FormBuilder,
  ) {};

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: [''],
      body: ['', Validators.required],
    })
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
    
  };

}
