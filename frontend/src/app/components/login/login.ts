import { Component } from '@angular/core';
forms

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  onSubmit() {
    // TODO: Call backend API here

    localStorage.setItem('token', 'dummy_jwt_token');
    this.router.navigate(['/dashboard']);
  }
}
