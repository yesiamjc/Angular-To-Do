import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  id?: string;
  _id?: string;  // Add this for MongoDB ID
  myTask: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TaskResponse {
  message: string;
  tsks: Task[];
}


@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/tasks`; // Fixed template literal

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<TaskResponse>(this.apiUrl).pipe(
      map((response: { tsks: any; }) => response.tsks)
    );
  }
  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`); // Fixed template literal
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task); // Fixed template literal
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // Fixed template literal
  }
}
