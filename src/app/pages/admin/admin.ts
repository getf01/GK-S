import { Component, inject, signal, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos';
import { Producto } from '../../interfaces/producto.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs'; // Añade estos a los imports de rxjs
import { map } from 'rxjs/operators'; // Asegúrate de importar map también
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent {
  private _productosService = inject(ProductosService);
  private injector = inject(Injector); // Inyectamos el injector

  cargando = signal(false);
  archivoSeleccionado: File | null = null;
  
  // Traemos las categorías de Firebase para el select
  listaCategorias = toSignal(
  this._productosService.getCategorias().pipe(
    map(res => res || []), // Si viene nulo, pone array vacío
    catchError(() => of([])) // Si hay error de Firebase, no rompe la app
  ), 
  { initialValue: [] }
);

  nuevoProducto: Producto = {
    nombre: '',
    precio: 0,
    categoria: '',
    imagen: '',
    stock: 0
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) { this.archivoSeleccionado = file; }
  }

  // Cambiamos el nombre para evitar conflictos y pasamos el elemento completo
procesarCategoria(input: HTMLInputElement) {
  const nombre = input.value.trim();
  if (!nombre) return;

  // 1. Verificamos si ya existe en la lista que ya tenemos cargada (listaCategorias)
  const existe = this.listaCategorias().some(
    (c: any) => c.nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (existe) {
    alert('❌ Esta categoría ya existe.');
    return;
  }

  this._productosService.addCategoria(nombre)
    .then(() => {
      alert('✅ Categoría creada');
      input.value = '';
    });
}

  async guardar() {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0 || !this.nuevoProducto.categoria || !this.archivoSeleccionado) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.cargando.set(true);
    try {
      const urlImagen = await this._productosService.subirImagen(this.archivoSeleccionado);
      this.nuevoProducto.imagen = urlImagen;
      await this._productosService.addProducto(this.nuevoProducto);
      
      alert('✅ ¡Publicado con éxito!');
      this.nuevoProducto = { nombre: '', precio: 0, categoria: '', imagen: '', stock: 0 };
      this.archivoSeleccionado = null;
    } catch (error) {
      alert('❌ Error al subir');
    } finally {
      this.cargando.set(false);
    }
  }
}