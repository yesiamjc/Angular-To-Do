import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() task!: Task;  
  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<Task>();

  isEditing = false;

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  deleteTask(): void {
    if (this.task._id) {  
      this.delete.emit(this.task._id);
    }
  }

  saveTask(): void {
    this.update.emit(this.task);
    this.toggleEdit();
  }
  getFormattedTime(): string {
    return moment(this.task.updatedAt).fromNow();
  }
}
