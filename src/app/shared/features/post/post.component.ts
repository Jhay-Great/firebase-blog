import { Component, Input, OnInit } from '@angular/core';
import { IPost, IPostWithComments } from '../../../core/models/post.interface';
import { PostsService } from '../../services/posts/posts.service';
import { Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/app/application.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  // @Input () post!:IPost;
  @Input () post!:IPostWithComments;

  constructor (
    private postService: PostsService,
    private applicationService: ApplicationService,
    private router: Router,
  ) {};

  ngOnInit(): void {
    console.log(this.post)
  }

  editPost (id:string) {
    console.log(id);
    this.router.navigate(['edit-post', `${id}`])
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

  
  authorPrivileges (id:string) {
    return this.applicationService.checkAuthorPrivileges(id);
    
    
  }


}
