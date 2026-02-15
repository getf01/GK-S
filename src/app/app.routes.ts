import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AdminComponent } from './pages/admin/admin';
export const routes: Routes = [
    {path: 'home', component: Home},
    {path: 'admin', component: AdminComponent},
    {path: '**', redirectTo: 'home'}
];
