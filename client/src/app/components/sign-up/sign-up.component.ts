import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls:['./sign-up.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SignUpComponent {
  userName = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');

  constructor(private authService: AuthService) {}

  signUp() {
    const user = { userName: this.userName(), email: this.email(), password: this.password() };
    this.authService.signUp(user).subscribe(() => {
      this.authService.signIn(user).subscribe();
    });
  }
}