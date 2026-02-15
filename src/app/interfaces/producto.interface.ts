// src/app/interfaces/producto.interface.ts
export interface Producto {
  id?: string;          
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;    
  stock: number;
}