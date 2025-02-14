import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../interfaces/product.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'products';
  private products$ = new BehaviorSubject<Product[]>([]);
  private searchTerm$ = new BehaviorSubject<string>('');

  private initialProducts: Product[] = [
    {
      id: '1',
      name: 'Laptop',
      description: 'High performance laptop for professionals',
      price: 1120,
      imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1120&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quantity: 10
    },
    {
      id: '2',
      name: 'Dell Laptop',
      description: 'Business-grade Dell laptop',
      price: 920,
      imageUrl: 'https://images.unsplash.com/photo-1554246247-6993b606e8b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quantity: 3
    }
  ];
  
  constructor(private storageService: StorageService) {
    this.initializeProducts();
  }

  private initializeProducts(): void {
    try {
      const savedProducts = this.storageService.getItem<Product[]>(this.STORAGE_KEY);
      if (Array.isArray(savedProducts) && savedProducts.length > 0) {
        this.products$.next(savedProducts);
      } else {
        this.products$.next(this.initialProducts);
        this.saveToStorage();
      }
    } catch (error) {
      console.error('Error loading products from storage:', error);
      this.products$.next(this.initialProducts);
    }
  }

  getProducts(): Observable<Product[]> {
    return combineLatest([this.products$, this.searchTerm$])
      .pipe(
        map(([products, searchTerm]) => {
          if (!searchTerm.trim()) {
            return products;
          }
          const term = searchTerm.toLowerCase().trim();
          return products.filter(product => 
            product.name.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term)
          );
        })
      );
  }

  getFilteredProducts(): Observable<Product[]> {
    return this.getProducts();
  }

  getProductsValue(): Product[] {
    return this.products$.getValue();
  }

  getProductById(id: string): Product | undefined {
    return this.products$.getValue().find(p => p.id === id);
  }

  updateProduct(updatedProduct: Product): void {
    if (!updatedProduct || !updatedProduct.id) {
      console.warn('Invalid product update attempted');
      return;
    }
    
    const products = this.products$.getValue();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    
    if (index !== -1) {
      products[index] = { ...updatedProduct };
      this.products$.next([...products]);
      this.saveToStorage();
    }
  }

  getSearchTerm(): Observable<string> {
    return this.searchTerm$.asObservable();
  }

  updateSearchTerm(term: string): void {
    this.searchTerm$.next(term || '');
  }

  addProduct(product: Product): void {
    if (!product || !product.id) {
      console.warn('Cannot add invalid product');
      return;
    }
    
    const currentProducts = this.products$.getValue();
    if (currentProducts.some(p => p.id === product.id)) {
      console.warn(`Product with ID ${product.id} already exists`);
      return;
    }
    
    this.products$.next([...currentProducts, { ...product }]);
    this.saveToStorage();
  }

  deleteProduct(id: string): void {
    if (!id) return;
    
    const currentProducts = this.products$.getValue();
    const filteredProducts = currentProducts.filter(product => product.id !== id);
    
    if (filteredProducts.length !== currentProducts.length) {
      this.products$.next(filteredProducts);
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    try {
      this.storageService.setItem(this.STORAGE_KEY, this.products$.getValue());
    } catch (error) {
      console.error('Failed to save products to storage:', error);
    }
  }

  generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}