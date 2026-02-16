import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router'; // IMPORTANTE

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent {
  private _productosService = inject(ProductosService);
  private route = inject(ActivatedRoute); // Inyectamos la ruta activa
  
  // Capturamos el parámetro 'nombreCat' de la URL
  private parametroUrl = toSignal(this.route.params);

  private todosLosProductos = toSignal(this._productosService.getProductos(), { initialValue: [] });

  public productos = computed(() => {
    const lista = this.todosLosProductos();
    
    // Prioridad 1: Lo que diga la URL (categoria/:nombreCat)
    // Prioridad 2: Lo que diga el Signal global
    const nombreDesdeUrl = this.parametroUrl()?.['nombreCat'];
    const filtro = nombreDesdeUrl || this._productosService.categoriaSeleccionada();

    if (!filtro) return lista;

    return lista.filter(p => 
      p.categoria.toLowerCase().trim() === filtro.toLowerCase().trim()
    );
  });
}