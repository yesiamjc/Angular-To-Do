import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface User {
  id:String,
  userName: string;
  userEmail: string;
  userTasks: any[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users = signal<User[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<User[]>(`${environment.apiUrl}/allUsers`, { withCredentials: true }).subscribe(
      (data: User[]) => {
        this.users.set(data);
        console.log(data)
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}