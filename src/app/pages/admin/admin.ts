import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos';
import { Producto } from '../../interfaces/producto.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, map } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent {
  private _productosService = inject(ProductosService);

  cargando = signal(false);
  archivoSeleccionado: File | null = null;
  editandoId = signal<string | null>(null); // Para saber si estamos editando o creando

  listaCategorias = toSignal(
    this._productosService.getCategorias().pipe(
      map(res => res || []),
      catchError(() => of([]))
    ), { initialValue: [] }
  );

  // NUEVO: Lista de productos para el CRUD
  listaProductos = toSignal(
    this._productosService.getProductos().pipe(
      map(res => res || []),
      catchError(() => of([]))
    ), { initialValue: [] }
  );

  nuevoProducto: Producto = { nombre: '', precio: 0, categoria: '', imagen: '', stock: 0, descripcion: '' };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) { this.archivoSeleccionado = file; }
  }

  procesarCategoria(input: HTMLInputElement) {
    const nombre = input.value.trim();
    if (!nombre) return;
    const existe = this.listaCategorias().some((c: any) => c.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) { alert('❌ Esta categoría ya existe.'); return; }
    this._productosService.addCategoria(nombre).then(() => { alert('✅ Categoría creada'); input.value = ''; });
  }

  async guardar() {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0 || !this.nuevoProducto.categoria) {
      alert('Por favor, completa los campos obligatorios.'); return;
    }

    this.cargando.set(true);
    try {
      // 1. Si hay archivo nuevo, lo subimos; si no, mantenemos la imagen anterior
      if (this.archivoSeleccionado) {
        const urlImagen = await this._productosService.subirImagen(this.archivoSeleccionado);
        this.nuevoProducto.imagen = urlImagen;
      }

      if (this.editandoId()) {
        // ACTUALIZAR
        await this._productosService.updateProducto(this.editandoId()!, this.nuevoProducto);
        alert('✅ Producto actualizado');
      } else {
        // CREAR NUEVO
        if (!this.archivoSeleccionado) throw new Error('Imagen requerida');
        await this._productosService.addProducto(this.nuevoProducto);
        alert('✅ ¡Publicado con éxito!');
      }

      this.limpiarFormulario();
    } catch (error) {
      alert('❌ Error al procesar');
    } finally {
      this.cargando.set(false);
    }
  }

  prepararEdicion(prod: Producto) {
    this.editandoId.set(prod.id || null);
    this.nuevoProducto = { ...prod };
    window.scrollTo(0, 0); // Sube la pantalla al formulario
  }

  async eliminarProducto(id: string | undefined) {
    if (id && confirm('¿Eliminar producto?')) {
      await this._productosService.deleteProducto(id);
    }
  }

  async eliminarCategoria(id: string | undefined) {
    if (id && confirm('¿Eliminar categoría?')) {
      await this._productosService.deleteCategoria(id);
    }
  }

  limpiarFormulario() {
    this.nuevoProducto = { nombre: '', precio: 0, categoria: '', imagen: '', stock: 0, descripcion: ''   };
    this.archivoSeleccionado = null;
    this.editandoId.set(null);
  }
}