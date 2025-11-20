import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');  // token saved after login
  }

  logout() {
    localStorage.removeItem('token');
  }
}
