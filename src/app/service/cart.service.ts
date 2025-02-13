import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../interfaces/cart-item.interface';
import { StorageService } from './storage.service'; 

@Injectable({
  providedIn: 'root' 
})
export class CartService {
  private cartItems: BehaviorSubject<CartItem[]>;

  constructor(private storageService: StorageService) {
    const savedCart = this.storageService.getItem<CartItem[]>('cart') || [];
    this.cartItems = new BehaviorSubject<CartItem[]>(savedCart);

    this.cartItems.subscribe(items => {
      this.storageService.setItem('cart', items);
    });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(cartItem: CartItem): void {
    const currentItems = this.cartItems.getValue();
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === cartItem.product.id
    );

    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex].quantity += cartItem.quantity;
    } else {
      currentItems.push(cartItem);
    }

    this.cartItems.next([...currentItems]);
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems.getValue();
    this.cartItems.next(currentItems.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentItems = this.cartItems.getValue();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex !== -1) {
      currentItems[itemIndex].quantity = quantity;
      this.cartItems.next([...currentItems]);
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.storageService.removeItem('cart'); 
    
  }

  getTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems.subscribe(items => {
        const total = items.reduce(
          (sum, item) => sum + (item.product.price * item.quantity), 
          0
        );
        observer.next(total);
      });
    });
  }
}
