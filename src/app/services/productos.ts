import { Injectable, inject, NgZone, signal } from '@angular/core';
import { 
  Firestore, collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc 
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto.interface';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private zone = inject(NgZone);

  categoriaSeleccionada = signal<string | null>(null);

  getProductos(): Observable<Producto[]> {
    return new Observable(subscriber => {
      const q = query(collection(this.firestore, 'productos'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        this.zone.run(() => {
          const productos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Producto[];
          subscriber.next(productos);
        });
      }, (error) => subscriber.error(error));
      return () => unsubscribe();
    });
  }

  // ... (Tus otros métodos getProductosPorCategoria y getCategorias están perfectos)
  
  getProductosPorCategoria(nombreCat: string): Observable<Producto[]> {
    return new Observable(subscriber => {
      const q = query(collection(this.firestore, 'productos'), where('categoria', '==', nombreCat));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        this.zone.run(() => {
          const productos = snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
          })) as Producto[];
          subscriber.next(productos);
        });
      }, (error) => subscriber.error(error));
      return () => unsubscribe();
    });
  }

  getCategorias(): Observable<any[]> {
    return new Observable(subscriber => {
      const q = query(collection(this.firestore, 'categorias'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        this.zone.run(() => {
          const categorias = snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
          }));
          subscriber.next(categorias);
        });
      }, (error) => subscriber.error(error));
      return () => unsubscribe();
    });
  }

  async subirImagen(file: File): Promise<string> {
    const filePath = `productos/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  addProducto(producto: Producto) {
    return addDoc(collection(this.firestore, 'productos'), producto);
  }

  addCategoria(nombre: string) {
    return addDoc(collection(this.firestore, 'categorias'), { nombre });
  }

  updateProducto(id: string, data: Partial<Producto>) {
    return updateDoc(doc(this.firestore, `productos/${id}`), data);
  }

  deleteProducto(id: string) {
    return deleteDoc(doc(this.firestore, `productos/${id}`));
  }

  deleteCategoria(id: string) {
    return deleteDoc(doc(this.firestore, `categorias/${id}`));
  }
}