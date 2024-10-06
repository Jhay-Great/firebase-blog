import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApplicationService } from '../../services/app/application.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  userInitial!:string;

  constructor (
    private applicationService: ApplicationService,
  ) {};

  ngOnInit(): void {
    // this.applicationService.getUserInitial();
    this.applicationService.getUser().subscribe({
      next: data => {
        console.log('user initial created: ', this.getFirstLetter(data.username));
        this.userInitial = this.getFirstLetter(data.username);
      }
    })
  }

  getFirstLetter (word:string):string {
    const letter = word?.charAt(0);
    return letter;
  }

}
