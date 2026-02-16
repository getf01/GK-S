import { Component, ViewChild, ElementRef, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router'; // Importa el Router
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  private _productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router); // Inyecta el router
  @ViewChild('muteIcon') muteIconElement!: ElementRef<HTMLElement>;
  @ViewChild('gkVideo') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('anuncioLayer') anuncioLayer!: ElementRef<HTMLElement>;

  isMuted = true; 
  anuncioVisible = true;
  listaCategorias = toSignal(this._productosService.getCategorias(), { initialValue: [] });

  banners = [
    { id: 1, type: 'image', content: 'logo.jpg', title: 'GK-HUB GAMING', description: '¡Bienvenido! Descubre las ofertas exclusivas.' },
    { id: 2, type: 'video', content: 'video.mp4', title: '', description: '' },
    { id: 3, type: 'image', content: 'naruto.jpg', title: '', description: '' },
    { id: 4, type: 'image', content: 'loki.jpg', title: '', description: '' },
    { id: 5, type: 'image', content: 'nogame.jpg', title: '', description: '' },
    { id: 6, type: 'image', content: 'simp.jpg', title: '', description: '' },
    { id: 7, type: 'image', content: 'strang.jpg', title: '', description: '' }
  ];

  seleccionarCategoria(nombre: string | null) {
  if (nombre) {
    // Esto cambia la URL a /categoria/Musica por ejemplo
    this.router.navigate(['/categoria', nombre]);
  } else {
    // Si es "Ver todo", podrías mandarlo a una lista general o al home
    this._productosService.categoriaSeleccionada.set(null);
  }
}

  ngAfterViewInit() {
    const carousel = document.getElementById('gkCarousel');
    carousel?.addEventListener('slid.bs.carousel', (event: any) => {
      if (this.videoElement) {
        const video = this.videoElement.nativeElement;
        event.to === 1 ? video.play().catch(() => {}) : video.pause();
      }
      this.cdr.detectChanges();
    });
  }

  toggleMute(event: Event) {
    event.stopPropagation();
    if (this.videoElement && this.muteIconElement) {
      this.isMuted = !this.isMuted;
      this.videoElement.nativeElement.muted = this.isMuted;
      const icon = this.muteIconElement.nativeElement;
      icon.className = this.isMuted ? 'bi bi-volume-mute-fill' : 'bi bi-volume-up-fill';
      this.cdr.detectChanges();
    }
  }

  cerrarAnuncio(event: Event) {
    event.stopPropagation();
    this.anuncioVisible = false;
    if (this.anuncioLayer) this.anuncioLayer.nativeElement.style.display = 'none';
    this.cdr.detectChanges();
  }
}