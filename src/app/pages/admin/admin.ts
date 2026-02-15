import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos'; // Ajusta si el nombre es diferente
import { Producto } from '../../interfaces/producto.interface';

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

  nuevoProducto: Producto = {
    nombre: '',
    precio: 0,
    categoria: '',
    imagen: '',
    stock: 0
  };

  // Capturar el archivo cuando el usuario lo elige
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  async guardar() {
    // Validación: Ahora la imagen es obligatoria como archivo
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0 || !this.nuevoProducto.categoria || !this.archivoSeleccionado) {
      alert('Por favor, completa todos los campos y selecciona una imagen.');
      return;
    }

    this.cargando.set(true);
    
    try {
      // 1. Subir la imagen primero y obtener la URL
      const urlImagen = await this._productosService.subirImagen(this.archivoSeleccionado);
      
      // 2. Asignar la URL al objeto producto
      this.nuevoProducto.imagen = urlImagen;

      // 3. Guardar todo en Firestore
      await this._productosService.addProducto(this.nuevoProducto);
      
      alert('✅ ¡Producto y Foto publicados con éxito!');
      
      // 4. Resetear formulario
      this.nuevoProducto = { 
        nombre: '', precio: 0, categoria: '', imagen: '', stock: 0 
      };
      this.archivoSeleccionado = null;
      
    } catch (error) {
      console.error('Error en el proceso:', error);
      alert('❌ Error al subir el producto');
    } finally {
      this.cargando.set(false);
    }
  }
}