import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../services/service.service';
import moment from 'moment';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html', 
  styleUrls: ['./task.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TaskComponent {
  task = input.required<Task>();
  deleteTask = output<string>();
  updateTask = output<Task>();
  isEditing = signal(false);

  toggleEdit(): void {
    this.isEditing.update(value => !value);
  }

  onDelete(): void {
    const taskId = this.task()._id;
    if (taskId) {  
      this.deleteTask.emit(taskId);
    }
  }

  saveTask(): void {
    this.updateTask.emit(this.task());
    this.toggleEdit();
  }

  getFormattedTime(): string {
    return moment(this.task().updatedAt).fromNow();
  }
}