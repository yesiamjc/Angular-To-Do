import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService, Task } from '../../services/service.service';
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
  editedTask = signal(''); 

  constructor(private service: ServiceService) {}

toggleTaskComplete(): void {
  const currentTask = this.task();
  const updatedTask = {
    ...currentTask,
    myTaskCompleted: !currentTask.myTaskCompleted
  };
  this.updateTask.emit(updatedTask);
}

  toggleEdit(): void {
    this.isEditing.update(value => !value);
    this.editedTask.set(this.task().myTask);
  }

  onDelete(): void {
    const taskId = this.task()._id;
    
    if (taskId) {  
      this.deleteTask.emit(taskId);
    }
  }

  saveTask(): void {
    const currentTask = this.task();
    currentTask.myTask = this.editedTask(); 
    this.updateTask.emit(currentTask);  // This just emits an event
    this.toggleEdit();
}

  getFormattedTime(): string {
    return moment(this.task().updatedAt).fromNow();
  }
}