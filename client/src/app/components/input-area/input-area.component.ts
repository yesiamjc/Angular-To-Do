import { Component } from '@angular/core';
import { ServiceService, Task } from '../../services/service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-input-area',
  templateUrl: './input-area.component.html',
  styleUrls: ['./input-area.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class InputAreaComponent {
  newTask: string = '';

  constructor(private taskService: ServiceService) {}

  addTask(): void {
    if (this.newTask.trim()) {
      const task: Task = { myTask: this.newTask.trim() };
      this.taskService.addTask(task).subscribe(() => {
        this.newTask = '';
        // Optionally, you can emit an event to refresh the task list
      });
    }
  }
}