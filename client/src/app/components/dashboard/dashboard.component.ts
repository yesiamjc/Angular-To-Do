import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userEmailToDelete = signal<string>('');
  userEmailToView = signal<string>('');

  constructor(private http: HttpClient) {}

  deleteUser(): void {
    const userEmail = this.userEmailToDelete();
    if (userEmail) {
      this.http.delete(`${environment.apiUrl}/delete`, {
        body: { userEmail },
        withCredentials: true
      }).subscribe(
        response => {
          console.log('User deleted successfully:', response);
          // Handle successful deletion (e.g., show a success message)
        },
        error => {
          console.error('Error deleting user:', error);
          // Handle error (e.g., show an error message)
        }
      );
    }
  }

  viewUser(): void {
    const userEmail = this.userEmailToView();
    if (userEmail) {
      // Implement view user functionality here
    }
  }
}