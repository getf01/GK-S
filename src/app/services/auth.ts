import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'; // Importante

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  
  // Convertimos el observable user$ en un Signal
  // Esto nos permite usar authService.usuario() en cualquier lado
  public usuario = toSignal(user(this.auth));

  async login(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, pass);
      this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Error en login:', error);
      alert('Credenciales incorrectas');
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/home']); // Mejor mandarlo al home al salir
  }
}