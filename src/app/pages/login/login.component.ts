import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../shared/services/app/application.service';
import { IUserResponseData } from '../../core/models/auth.interface';
import { Title, Meta } from '@angular/platform-browser';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  subscription!: Subscription;
  isLoading:boolean = false;
  isError:boolean = false;
  isSuccess:boolean = false;
  response!:string;


  constructor(
    private authService: AuthService, 
    private applicationService: ApplicationService,
    private analyticsService: AnalyticsService,
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
  ) {
    // sets dynamic page title
    this.titleService.setTitle('WriteUp | login page');

    // sets dynamic meta tag for login page
    this.metaService.updateTag({name: 'keywords', content: 'blog post, login, registration, write up,'})
    this.metaService.updateTag({name: 'description', content: 'a user friendly login page for write up blog application.'})
  }

  ngOnInit(): void {
    this.analyticsService.trackPageView('login');
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  reset () {
    this.form.reset();
  }

  login() {
    this.analyticsService.trackButtonClick('login');
    this.isLoading = true;
    console.log('logging in');
    const formData = this.form;
    if (formData.invalid) {
      console.log(formData.value);
      this.isLoading = false;
      return;
    }
    const data = formData.value;
    this.reset();
    const response = this.authService.login(data);
    this.subscription = response.subscribe({
      next: response => {
        this.analyticsService.trackLogin();
        this.isLoading = false;
        // route to page
        console.log('response: ', response);
        const userData: IUserResponseData = {...response, username: data.username}
        this.applicationService.setUser(response)
        this.router.navigate(['profile'])
      },
      error: error => {
        // display error message
        console.log('logging error: ', error);
        this.isLoading = false;
        this.isError = true;
        this.response = error.message;
      },
      complete: () => {
        console.log('done');
        this.isLoading = false;
      }
    })
  }

  signInWithProvider() {
    this.authService.googleSignIn();
  }
}
