import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationService } from '../../shared/services/app/application.service';
import { AsyncPipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { IUserResponseData } from '../../core/models/auth.interface';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../../core/services/firebase/firebase.service';
import { IComment, IPost } from '../../core/models/post.interface';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit, OnDestroy{
  user$!: any; // change type
  email!:string;
  username!:string;
  date!:string;
  postUserId!:string;
  user!:IUserResponseData;
  userPosts!: IPost[];
  subscription!:Subscription;
  postsSubscription!: Subscription;

  constructor (
    private applicationService: ApplicationService,
    private firebase: FirebaseService,
    private router: Router,
    private auth: AuthService,
    private titleService: Title,
    private metaService: Meta,
  ) {
    // sets title page
    this.titleService.setTitle('Write up | Profile');

    // sets meta tags
    this.metaService.updateTag({
      name: 'keywords', content: 'write up blog, profile, ',
    });
    this.metaService.updateTag({
      name: 'description', content: 'Welcome to write up. Create a post about your favorite topic and share with like minds. Grow your community through your interest and passion.',
    })
  }

  ngOnInit(): void {
    // gets the user details
    this.getUserDetails();
    // this.authorPrivileges();
    // this.user$.subscribe((value:any) => console.log('user: ', value))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUserDetails () {
    console.log('loggings')
    this.subscription = this.user$ = this.applicationService.getUser().subscribe({
      next: value => {
        this.user = value;
        console.log('data from user: ', value);
        
        const id = value.uid;
        this.postUserId = id;
        console.log('user id: ', id);
        this.getUserPost(id);
        console.log('this.user value: ', this.user);

        // console.log(this.email, this.username);
      }
    });
  }

  logout () {
    this.auth.logout();
    this.router.navigate(['']);
  }

  getUserPost (id:string) {
    console.log('id used in where: ', id);
    const response = this.firebase.getAllRelatedData('posts', id);
    this.postsSubscription = response.subscribe({
      next: value => {
        console.log('posts subscription data: ', value);
        // this.userPosts = value; // assign user posts
      }
    })
  }

  // authorPrivileges () { strictly for testing not necessary after dev mode
  //   // const id = this.auth.getUserDetails();
  //   // console.log(id === this.postUserId);
  // }

}
