import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AdminComponent } from './pages/admin/admin';
import { LoginComponent } from './pages/login/login'; // Importa el login
import { ProductosComponent } from './pages/productos/productos'; // Tu lista de targets
import { authGuard } from './guards/auth-guard'; // Importante importar el guard
export const routes: Routes = [
    { path: 'home', component: Home },
    { 
      path: 'admin', 
      component: AdminComponent, 
      canActivate: [authGuard] 
    },
    { path: 'login', component: LoginComponent },
    
    // --- ESTAS DOS SON LA CLAVE ---
    { path: 'productos', component: ProductosComponent }, // <--- AÑADE ESTA (Para el buscador)
    { path: 'categoria/:nombreCat', component: ProductosComponent }, // Para categorías del home
    
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];