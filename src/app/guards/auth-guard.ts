import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Verificamos si el usuario existe en Firebase
  return user(auth).pipe(
    take(1), 
    map((u) => {
      if (u) {
        return true; // Hay sesión, puede pasar
      } else {
        // No hay sesión, lo mandamos al login
        return router.parseUrl('/login'); 
      }
    })
  );
};