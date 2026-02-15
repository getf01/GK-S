import 'zone.js'; 
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// CAMBIO AQUÍ: Importamos la clase 'App' desde el archivo './app/app'
import { App } from './app/app'; 

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));