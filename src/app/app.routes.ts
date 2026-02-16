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
      canActivate: [authGuard] // <--- El candado está puesto aquí
    },
    { path: 'login', component: LoginComponent },
    { path: 'categoria/:nombreCat', component: ProductosComponent }, // Para ver productos de una categoría
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Si está vacío, va al home
    { path: '**', redirectTo: 'home' } // Si escribe cualquier cosa mal, va al home
];