import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DashboardComponent {
  userEmailToDelete = '';
  userEmailToView = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  deleteUser(): void {
    if (this.userEmailToDelete) {
      this.http.delete(`${environment.apiUrl}/users/delete`, {
        body: { userEmail: this.userEmailToDelete },
        withCredentials: true
      }).subscribe(
        response => {
          console.log('User deleted successfully:', response);
          // Optional: Add success message or refresh
        },
        error => {
          console.error('Error deleting user:', error);
          // Optional: Handle error
        }
      );
    }
  }

  viewUser(): void {
  if (this.userEmailToView) {
    this.http.get(`${environment.apiUrl}/users/getUser`, {
      params: { userEmail: this.userEmailToView },
      withCredentials: true
    }).subscribe(
      user => {
        // Store email in local storage as a fallback
        localStorage.setItem('viewUserEmail', this.userEmailToView);
        
        // Navigate to details page
        this.router.navigate(['/details'], { 
          state: { userData: user } 
        });
      },
      error => {
        console.error('Error fetching user:', error);
        // Optional: Show error message to user
      }
    );
  }
}
}