import { Component } from '@angular/core';
import { InputAreaComponent } from '../input-area/input-area.component';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-home',
  imports: [ InputAreaComponent, TaskListComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
