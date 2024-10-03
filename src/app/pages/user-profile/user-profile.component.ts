import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../shared/services/app/application.service';
import { AsyncPipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [AsyncPipe, ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{
  user$!: any; // change type

  constructor (
    private applicationService: ApplicationService,
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
    this.user$.subscribe((value:any) => console.log('user: ', value))
  }

  getUserDetails () {
    // console.log('loggings')
    this.user$ = this.applicationService.getUser();
  }

  logout () {
    this.auth.logout();
  }

}
