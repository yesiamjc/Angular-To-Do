import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

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

  fetchUserByEmail(email: string) {
    this.http.get(`${environment.apiUrl}/users/getUser`, {
      params: { userEmail: email },
      withCredentials: true
    }).subscribe(
      (user: any) => {
        this.userData = user;
        this.tasks = user.userTasks || [];
        // Clear the stored email after successful fetch
        localStorage.removeItem('viewUserEmail');
      },
      error => {
        console.error('Error fetching user:', error);
        this.router.navigate(['/dashboard']);
      }
    );
  }

  fetchUserTasks() {
    if (this.userData && this.userData.userEmail) {
      this.http.get(`${environment.apiUrl}/users/getUser`, {
        params: { userEmail: this.userData.userEmail },
        withCredentials: true
      }).subscribe(
        (response: any) => {
          this.tasks = response.userTasks || [];
        },
        error => {
          console.error('Error fetching tasks:', error);
          this.router.navigate(['/dashboard']);
        }
      );
    }
  }
}