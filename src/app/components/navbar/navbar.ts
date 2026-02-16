import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth'; 
import { Router } from '@angular/router'; // AGREGAR
@Component({
  selector: 'app-navbar',
  standalone: true, // Muy importante
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent { // Cambiamos a NavbarComponent para ser estándar
  public authService = inject(AuthService);

  salir() {
    this.authService.logout();
    
  }
  private router = inject(Router);

ejecutarBusqueda(termino: string) {
  const q = termino.trim();
  if (!q) return;

  this.router.navigate(['/productos'], { // <--- Debe coincidir con el path de routes
    queryParams: { q: q }
  });
}
}