import { Injectable, inject, NgZone } from '@angular/core';
import { 
  Firestore, collection, addDoc, query, where, onSnapshot 
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto.interface';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private zone = inject(NgZone);

  // --- OBTENER TODOS LOS PRODUCTOS ---
  getProductos(): Observable<Producto[]> {
    return new Observable(subscriber => {
      const q = query(collection(this.firestore, 'productos'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const productos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Producto[];
        subscriber.next(productos);
      }, (error) => subscriber.error(error));
      return () => unsubscribe();
    });
  }

  // --- FILTRAR POR CATEGORÍA (Corregido para evitar el error _Query) ---
  getProductosPorCategoria(nombreCat: string): Observable<Producto[]> {
    return new Observable(subscriber => {
      // Creamos la consulta nativa
      const q = query(
        collection(this.firestore, 'productos'), 
        where('categoria', '==', nombreCat)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const productos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Producto[];
        subscriber.next(productos);
      }, (error) => subscriber.error(error));

      return () => unsubscribe();
    });
  }

  // --- CATEGORÍAS (Ya estaba funcionando) ---
  getCategorias(): Observable<any[]> {
    return new Observable(subscriber => {
      const q = query(collection(this.firestore, 'categorias'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const categorias = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        subscriber.next(categorias);
      }, (error) => subscriber.error(error));
      return () => unsubscribe();
    });
  }

  // --- ESCRITURA Y STORAGE ---
  async subirImagen(file: File): Promise<string> {
    const filePath = `productos/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  addProducto(producto: Producto) {
    const productosRef = collection(this.firestore, 'productos');
    return addDoc(productosRef, producto);
  }

  addCategoria(nombre: string) {
    const catRef = collection(this.firestore, 'categorias');
    return addDoc(catRef, { nombre: nombre });
  }
}