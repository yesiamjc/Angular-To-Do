import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../services/service.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TaskComponent {
  @Input() task: any;
  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<Task>();

  deleteTask(): void {
    if (this.task.id) {
      this.delete.emit(this.task.id);
    }
  }

  updateTask(): void {
    this.update.emit(this.task);
  }
}