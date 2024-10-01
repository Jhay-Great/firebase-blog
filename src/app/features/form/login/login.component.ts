import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor (
    private authService: AuthService,
    private fb: FormBuilder,
  ) {};

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    })
  }

  get email () {
    return this.form.get('email');
  }

  get password () {
    return this.form.get('password');
  }

  login () {
    console.log('logging in')
    const formData = this.form;
    if (formData.invalid) {
      console.log(formData.value);
      return;
    }
    const data = formData.value;
    this.authService.login(data);
  }

}
