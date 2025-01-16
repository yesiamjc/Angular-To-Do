import { Component, signal, inject } from '@angular/core';
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
  private taskService = inject(ServiceService);
  newTask = signal('');

  addTask(): void {
    if (this.newTask().trim()) {
      const task: Task = { myTask: this.newTask().trim() };
      this.taskService.addTask(task).subscribe(() => {
        this.newTask.set('');
      });
    }
  }
}