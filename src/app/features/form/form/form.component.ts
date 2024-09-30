import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
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
    const formData = this.form;
    if (formData.invalid) {
      console.log(formData);
      return;
    }
    const data = formData.value;
    this.authService.login(data);
  }

}
