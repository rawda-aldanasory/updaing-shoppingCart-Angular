import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'products';
  private products$ = new BehaviorSubject<Product[]>([
    {
      id: '1',
      name: 'Laptop',
      description: 'discriptionnnnnnnn',
      price: 1120,
      imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1120&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quantity: 10
    }
  ]);
  
  private searchTerm$ = new BehaviorSubject<string>('');

  constructor(private StorageService: StorageService) {
    const savedProducts = this.StorageService.getItem<Product[]>(this.STORAGE_KEY);
    if (savedProducts) {
      this.products$.next(savedProducts);
    }
  }

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getSearchTerm(): Observable<string> {
    return this.searchTerm$.asObservable();
  }

  updateSearchTerm(term: string): void {
    this.searchTerm$.next(term);
  }



  addProduct(product: Product): void {
    const currentProducts = this.products$.getValue();
    this.products$.next([...currentProducts, product]);
    this.saveToStorage();
  }

  updateProduct(updatedProduct: Product): void {
    const currentProducts = this.products$.getValue();
    const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      currentProducts[index] = updatedProduct;
      this.products$.next([...currentProducts]);
      this.saveToStorage();
    }
  }

  deleteProduct(id: string): void {
    const currentProducts = this.products$.getValue();
    this.products$.next(currentProducts.filter(product => product.id !== id));
    this.saveToStorage();
  }

  private saveToStorage(): void {
    this.StorageService.setItem(this.STORAGE_KEY, this.products$.getValue());
  }
}