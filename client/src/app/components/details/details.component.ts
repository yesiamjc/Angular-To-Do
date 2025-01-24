import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DetailsComponent implements OnInit {
  userData: any = null;
  tasks: any[] = [];
  errorMessage: string = '';
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Check if state contains user data
    const navigation = this.router.getCurrentNavigation();
    const navigationData = navigation?.extras.state;

    if (navigationData && navigationData['userData']) {
      this.userData = navigationData['userData'];
      this.checkUserRole();
      this.fetchUserTasks();
    } else {
      // If no data in navigation state, check if we have a stored email in local storage
      const storedEmail = localStorage.getItem('viewUserEmail');
      if (storedEmail) {
        this.fetchUserByEmail(storedEmail);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  checkUserRole() {
    // Assuming user role is part of userData
    this.isAdmin = this.userData?.userRole === 'admin';
  }

  fetchUserByEmail(email: string) {
    this.http.get(`${environment.apiUrl}/users/getUser`, {
      params: { userEmail: email },
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    ).subscribe({
      next: (user: any) => {
        this.userData = user;
        this.checkUserRole();
        this.tasks = user.userTasks || [];
        localStorage.removeItem('viewUserEmail');
      },
      error: (error) => {
        this.errorMessage = error;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  fetchUserTasks() {
    if (this.userData && this.userData.userEmail) {
      this.http.get(`${environment.apiUrl}/users/getUser`, {
        params: { userEmail: this.userData.userEmail },
        withCredentials: true
      }).pipe(
        catchError(this.handleError)
      ).subscribe({
        next: (response: any) => {
          this.tasks = response.userTasks || [];
        },
        error: (error) => {
          this.errorMessage = error;
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  reassignTask(taskId: string) {
    this.http.patch(`${environment.apiUrl}/users/${taskId}/reassign`, {}, {
      withCredentials: true,
      observe: 'response' // Add this to get full response
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Full error:', error);
        
        // More detailed error handling
        if (error.status === 403) {
          this.errorMessage = 'Unauthorized: Admin access required';
        } else if (error.status === 404) {
          this.errorMessage = 'Task not found';
        } else {
          this.errorMessage = error.message || 'An unexpected error occurred';
        }
        
        return throwError(() => error);
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Task reassigned successfully', response.body);
        
        // Update local tasks list
        const taskIndex = this.tasks.findIndex(t => t._id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = response.body;
        }
        
        this.errorMessage = ''; // Clear any previous errors
      },
      error: (error) => {
        console.error('Reassign task error:', error);
      }
    });
  }
  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}