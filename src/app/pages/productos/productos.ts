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

  // Capturamos también los queryParams (donde viaja la 'q')
  private queryParams = toSignal(this.route.queryParams);


  public productos = computed(() => {
  const lista = this.todosLosProductos();
  const nombreDesdeUrl = this.parametroUrl()?.['nombreCat'];
  const busqueda = this.queryParams()?.['q']; 
  
  // Si hay búsqueda en el buscador del NAV (el parámetro 'q')
  if (busqueda) {
    const q = busqueda.toLowerCase().trim();
    return lista.filter(p => 
      p.nombre.toLowerCase().includes(q) || 
      p.descripcion?.toLowerCase().includes(q)
    );
  } 

  // Si NO hay búsqueda, pero el usuario entró por una Categoría
  const filtroCat = nombreDesdeUrl || this._productosService.categoriaSeleccionada();
  if (filtroCat) {
    return lista.filter(p => 
      p.categoria.toLowerCase().trim() === filtroCat.toLowerCase().trim()
    );
  }

  // Si no hay nada, mostramos todo
  return lista;
});
}