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
    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.tasks = data;
    });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== id);
    });
  }

  updateTask(task: Task): void {
    if (task.id) {
      this.taskService.updateTask(task.id, task).subscribe(updatedTask => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      });
    }
  }
}