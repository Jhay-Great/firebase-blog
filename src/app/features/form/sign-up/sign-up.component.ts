import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit{
  form!:FormGroup;

  constructor (
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required]],
    })
  }

  
  get email () {
    return this.form.get('email');
  }

  get password () {
    return this.form.get('password');
  }

  get confirmPassword () {
    return this.form.get('confirmPassword');
  }

  signUp () {
    const formData = this.form;
    if (formData.invalid) {
      console.log(formData);
      return;
    }
    const data = formData.value;
    this.authService.signup(data);
  }

  togglePasswordVisibility () {

  }


}
