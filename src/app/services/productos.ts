import { Injectable, inject, NgZone } from '@angular/core'; // Añade NgZone
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto.interface';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private zone = inject(NgZone); // Inyectamos la Zona

  getProductos(): Observable<Producto[]> {
    const productosRef = collection(this.firestore, 'productos');
    return collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>;
  }

  async subirImagen(file: File): Promise<string> {
    // Ejecutamos fuera de Angular para que no se queje del contexto
    return this.zone.runOutsideAngular(async () => {
      const filePath = `productos/${Date.now()}_${file.name}`;
      const fileRef = ref(this.storage, filePath);
      
      try {
        const snapshot = await uploadBytes(fileRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (error) {
        throw error;
      }
    });
  }

  addProducto(producto: Producto) {
    const productosRef = collection(this.firestore, 'productos');
    return addDoc(productosRef, producto);
  }
}