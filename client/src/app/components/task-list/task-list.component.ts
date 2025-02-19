import { Component, OnInit, signal } from '@angular/core';
import { ServiceService, Task } from '../../services/service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TaskComponent]
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);

  constructor(private taskService: ServiceService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe(
      (data: Task[]) => {
        this.tasks.set(data); 
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      // Change task.id to task._id
      this.tasks.set(this.tasks().filter(task => task._id !== id));
    });
  }

  updateTask(task: Task): void {
    // Change task.id to task._id
    if (task._id) {
      this.taskService.updateTask(task._id, task).subscribe(updatedTask => {
        // Change t.id to t._id
        const index = this.tasks().findIndex(t => t._id === task._id);
        if (index !== -1) {
          const updatedTasks = [...this.tasks()];
          updatedTasks[index] = updatedTask;
          this.tasks.set(updatedTasks);
        }
      });
    }
  }

  

  onTaskAdded(newTask: Task): void {
    this.tasks.set([...this.tasks(), newTask]);
  }
}