import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  @ViewChild('gkVideo') videoElement!: ElementRef<HTMLVideoElement>;
  
  isMuted = true; 
  anuncioVisible = true;

  ngAfterViewInit() {
    const carousel = document.getElementById('gkCarousel');
    
    carousel?.addEventListener('slid.bs.carousel', (event: any) => {
      const index = event.to; 
      
      if (this.videoElement) {
        if (index === 1) { // El video es el segundo slide
          this.videoElement.nativeElement.play().catch(err => console.log("Esperando interacción..."));
        } else {
          this.videoElement.nativeElement.pause();
        }
      }
    });
  }

  toggleMute(event: Event) {
    event.preventDefault();
    event.stopPropagation(); 
    
    if (this.videoElement) {
        this.isMuted = !this.isMuted;
        const video = this.videoElement.nativeElement;
        video.muted = this.isMuted;
        
        // Forzamos el play para asegurar que el cambio de audio se procese
        video.play().catch(e => console.error("Error al reproducir:", e));
    }
}

  cerrarAnuncio(event: Event) {
    event.stopPropagation();
    this.anuncioVisible = false;
  }

  banners = [
    { id: 1, type: 'image', content: 'logo.jpg', title: 'GK-HUB GAMING', description: '¡Bienvenido a GK-HUB GAMING! Descubre las cuentas Streaming y ofertas exclusivas en nuestra tienda.' },
    { id: 2, type: 'video', content: 'video.mp4', title: '', description: '' },
    { id: 3, type: 'image', content: 'naruto.jpg', title: '', description: '' },
    { id: 4, type: 'image', content: 'loki.jpg', title: '', description: '' },
    { id: 5, type: 'image', content: 'nogame.jpg', title: '', description: '' },
    { id: 6, type: 'image', content: 'simp.jpg', title: '', description: '' },
    { id: 7, type: 'image', content: 'strang.jpg', title: '', description: '' }
  ];
}