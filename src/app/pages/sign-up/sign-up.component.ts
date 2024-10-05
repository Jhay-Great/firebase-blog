import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { passwordValidator } from '../../utils/passwordValidator';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  isLoading:boolean = false;
  isError:boolean = false;
  isSuccess:boolean = false;
  response!:string;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
  ) {
    // sets title page
    this.titleService.setTitle('Write up | Sign up');

    // sets meta tags
    this.metaService.updateTag({
      name: 'keywords', content: 'write up blog, blogs, posts, sign up, registration, join us',
    });
    this.metaService.updateTag({
      name: 'description', content: 'Join our community! Sign up to access exclusive content and features.',
    })
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    }, {validators: passwordValidator});
  }

  get username () {
    return this.form.get('username');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  reset () {
    this.form.reset();
  }

  signUp() {
    this.isLoading = true;
    this.reset();
    const formData = this.form;
    if (formData.invalid) {
      console.log(formData);
      return;
    }
    const data = formData.value;
    console.log('console.log: ', data);
    const response = this.authService.signup(data);
    response.subscribe({
      next: value => {
        console.log(value);
        this.isLoading = false;
        this.router.navigate(['login'])

      },
      error: error => {
        console.log(error);
        this.isLoading = false;
        this.isError = true;
        this.response = error.message;
        
      },
      complete: () => {
        this.isLoading = false;
        console.log('done');
      }
    })
  }

  togglePasswordVisibility() {}
}
