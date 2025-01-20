import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  signUp(user: any) {
    return this.http.post(`${this.apiUrl}/signUp`, user);
  }

  signIn(user: any) {
    return this.http.post(`${this.apiUrl}/signIn`, user).pipe(
      map((response: any) => {
        if (typeof document !== 'undefined') {
          document.cookie = `token=${response.token}; path=/; max-age=7200`;
        }
        this.isAuthenticated.set(true);
        this.router.navigate(['/']);
      })
    );
  }

  signOut() {
    if (typeof document !== 'undefined') {
      document.cookie = 'token=; path=/; max-age=0';
    }
    this.isAuthenticated.set(false);
    this.router.navigate(['/sign-in']);
  }

  getUserData() {
    return this.http.get(`${this.apiUrl}/me`);
  }

  checkAuthentication() {
    if (typeof document !== 'undefined') {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (token) {
        this.isAuthenticated.set(true);
      } else {
        this.isAuthenticated.set(false);
      }
    }
  }
}