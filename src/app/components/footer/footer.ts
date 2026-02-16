import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // IMPORTANTE

@Component({
  selector: 'app-footer',
  standalone: true, // Asegúrate de que sea standalone si tu proyecto lo es
  imports: [RouterModule], // Añadimos esto para los enlaces
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer { }