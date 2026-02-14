import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private firestore: Firestore) { }

  // Obtener todos los productos para mostrar en las Cards
  getProductos(): Observable<Producto[]> {
    const productosRef = collection(this.firestore, 'productos');
    return collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>;
  }

  // Guardar un nuevo producto (el que subas desde el panel)
  addProducto(producto: Producto) {
    const productosRef = collection(this.firestore, 'productos');
    return addDoc(productosRef, producto);
  }
}