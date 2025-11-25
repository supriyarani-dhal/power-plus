import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isLogin = true;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  onSubmitLogin() {
    if (this.loginForm.invalid) {
      console.log('Please enter valid email and password.');
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Please enter valid email and password',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
      return;
    }

    const { email, password } = this.loginForm.value;

    this.http.post('http://localhost:3000/api/login', { email, password })
      .subscribe({
        next: (res: any) => {

          // SUCCESS MESSAGE
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Login Successful! Redirecting to dashboard...',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });

          localStorage.setItem('token', res.token);

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 3000);
        },

        error: () => {
          // ERROR MESSAGE
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Invalid email or password',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
      });
  }

  onSubmitRegister() {
    if (this.registerForm.invalid) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Please fill all fields properly',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    this.http.post('http://localhost:3000/api/register', this.registerForm.value)
      .subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Registration Successful!',
            timer: 3000,
            showConfirmButton: false,
          });

          this.isLogin = true; // switch form automatically
        },

        error: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Registration failed',
            timer: 3000,
            showConfirmButton: false,
          });
        }
      });
  }
}
