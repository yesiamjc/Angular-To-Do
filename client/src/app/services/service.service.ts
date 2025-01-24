import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Task {
  _id?: string;  
  id?: string;
  myTask: string;
  myTaskCompleted?: boolean;
  myTaskUser?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<{ message: string, tsks: Task[] }>(this.apiUrl, { withCredentials: true }).pipe(
      map(response => response.tsks), 
      catchError(this.handleError)
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }


  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  updateTask(id: string, task: Task): Observable<Task> {
    const updateData = {
      myTask: task.myTask,
      myTaskCompleted: task.myTaskCompleted
    };

    if (task.myTaskCompleted) {
      this.sendCompletionEmail(id);
    }
  
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, updateData, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

deleteTask(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
    catchError(this.handleError)
  );
}



  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  sendCompletionEmail(taskId: string) {
    this.http.post(`${this.apiUrl}/send-email`, { taskId }, { 
      withCredentials: true 
    }).subscribe({
      next: () => console.log('Email sent successfully'),
      error: (error) => console.error('Error sending email:', error)
    });
  }
}