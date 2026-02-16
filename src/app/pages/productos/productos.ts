import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent {
  private _productosService = inject(ProductosService);
  
  // Convertimos el observable a Signal para que Angular maneje la detección de cambios eficientemente
  public productos = toSignal(this._productosService.getProductos(), { initialValue: [] });
}