import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // ¡Importante para el [(ngModel)]!
  templateUrl: './login.html', // Ahora apunta al archivo externo
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  pass = '';
  private authService = inject(AuthService);

  onLogin() {
    this.authService.login(this.email, this.pass);
  }
}