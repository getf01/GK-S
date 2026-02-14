import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importaciones de Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth'; // Para el Login de Admin

const firebaseConfig = {
  apiKey: "AIzaSyACsR0FdyL7KCjkJzK4cMdB00f859JTUfs",
  authDomain: "coffee-spark-ai-barista-ef23d.firebaseapp.com",
  projectId: "coffee-spark-ai-barista-ef23d",
  storageBucket: "coffee-spark-ai-barista-ef23d.firebasestorage.app",
  messagingSenderId: "904194597488",
  appId: "1:904194597488:web:78bac86d74cf56bc318ab5"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Inicialización de los servicios
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth())
  ]
};