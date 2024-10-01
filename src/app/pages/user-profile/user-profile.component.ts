import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../shared/services/app/application.service';
import { AsyncPipe } from '@angular/common';

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
  ) {};

  ngOnInit(): void {
    // gets the user details
    this.getUserDetails();
    this.user$.subscribe((value:any) => console.log('user: ', value))
  }

  getUserDetails () {
    this.user$ = this.applicationService.getUser();
  }

}
