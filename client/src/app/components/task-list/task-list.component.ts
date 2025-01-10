import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TaskComponent]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.tasks = data;
    });
  }

  addTask(): void {
    if (this.newTask.trim()) {
      const task: Task = { myTask: this.newTask.trim() };
      this.taskService.addTask(task).subscribe((newTask: Task) => {
        this.tasks.push(newTask);
        this.newTask = '';
      });
    }
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== id);
    });
  }

  updateTask(task: Task): void {
    this.taskService.updateTask(task.id!, task).subscribe(updatedTask => {
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
    });
  }
}