import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SignInComponent {
  email = signal<string>('');
  password = signal<string>('');

  constructor(private authService: AuthService) {}

  signIn() {
    const user = { userEmail: this.email(), userPassword: this.password() };
    this.authService.signIn(user).subscribe();
  }
}