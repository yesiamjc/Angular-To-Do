import { Component, OnInit } from '@angular/core';
import { ServiceService, Task } from '../../services/service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TaskComponent]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: ServiceService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
      },
      error: (error) => console.error('Error fetching tasks:', error)
    });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task._id !== id);  
      },
      error: (error) => console.error('Error deleting task:', error)
    });
  }

updateTask(task: Task): void {
  if (task._id) {
    this.taskService.updateTask(task._id, task).subscribe({
      next: () => {
        this.taskService.getTasks().subscribe(tasks => {
          this.tasks = tasks;
        });
      },
      error: (error) => console.error('Error updating task:', error)
    });
  }
}
  
}