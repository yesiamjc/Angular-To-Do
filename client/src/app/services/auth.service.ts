import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  isAuthenticated = signal<boolean>(false);
  userName = signal<string>('');
  userRole = signal<string>('');

  constructor(private http: HttpClient, private router: Router) {}

  signUp(user: any) {
    return this.http.post(`${this.apiUrl}/signUp`, user, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  signIn(user: any) {
    return this.http.post(`${this.apiUrl}/signIn`, user, { withCredentials: true }).pipe(
      map((response: any) => {
        if (typeof document !== 'undefined') {
          document.cookie = `token=${response.token}; path=/; max-age=7200`;
        }
        this.isAuthenticated.set(true);
        this.fetchUserData();
        this.router.navigate(['/']);
      }),
      catchError(this.handleError)
    );
  }

  signOut() {
    if (typeof document !== 'undefined') {
      document.cookie = 'token=; path=/; max-age=0';
    }
    this.isAuthenticated.set(false);
    this.userName.set('');
    this.userRole.set(''); 
    this.router.navigate(['/sign-in']);
  }

  getUserData() {
    return this.http.get(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  fetchUserData() {
    this.http.get(`${this.apiUrl}/me`, { withCredentials: true }).subscribe(
      (user: any) => {
        this.userName.set(user.userName);
        this.userRole.set(user.userRole); 
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  checkAuthentication() {
    if (typeof document !== 'undefined') {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (token) {
        this.isAuthenticated.set(true);
        this.fetchUserData();
      } else {
        this.isAuthenticated.set(false);
      }
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}