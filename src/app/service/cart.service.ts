import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, map, share } from 'rxjs';
import { CartItem } from '../interfaces/cart-item.interface';
import { StorageService } from './storage.service'; 
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root' 
})
export class CartService implements OnDestroy {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private readonly STORAGE_KEY = 'cart';
  private storageSubscription: any;
  private _total$ = this.cartItems.pipe(
    map(items => items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)),
    share()
  );

  constructor(
    private storageService: StorageService,
    private productService: ProductService
  ) {
    this.initializeCart();
    this.setupStoragePersistence();
  }

  private initializeCart(): void {
    try {
      const savedCart = this.storageService.getItem<CartItem[]>(this.STORAGE_KEY) || [];
      if (Array.isArray(savedCart)) {
        this.cartItems.next(savedCart);
      } else {
        console.warn('Invalid cart data in storage, initializing empty cart');
        this.cartItems.next([]);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cartItems.next([]);
    }
  }

  private setupStoragePersistence(): void {
    this.storageSubscription = this.cartItems.subscribe(items => {
      try {
        this.storageService.setItem(this.STORAGE_KEY, items);
      } catch (error) {
        console.error('Failed to save cart to storage:', error);
      }
    });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  findCartItem(productId: string): CartItem | undefined {
    const currentCart = this.cartItems.getValue();
    return currentCart.find(item => item.product.id === productId);
  }

  addToCart(cartItem: CartItem): void {
    if (!cartItem || !cartItem.product || cartItem.quantity <= 0) {
      console.warn('Invalid cart item', cartItem);
      return;
    }

    const currentItems = this.cartItems.getValue();
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === cartItem.product.id
    );

    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex].quantity += cartItem.quantity;
    } else {
      currentItems.push({ ...cartItem });
    }

    this.cartItems.next([...currentItems]);
    this.updateProductQuantity(cartItem.product.id, -cartItem.quantity);
  }

  removeItem(productId: string): void {
    const currentItems = this.cartItems.getValue();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex !== -1) {
      const removedQuantity = currentItems[itemIndex].quantity;
      currentItems.splice(itemIndex, 1);
      this.cartItems.next([...currentItems]);
      this.updateProductQuantity(productId, removedQuantity);
    }
  }

  updateItemQuantity(productId: string, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.cartItems.getValue();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex !== -1) {
      const oldQuantity = currentItems[itemIndex].quantity;
      const quantityDiff = newQuantity - oldQuantity;
      
      // Check if we have enough product quantity
      const product = this.productService.getProductById(productId);
      if (product && product.quantity <quantityDiff) {
        console.warn('Not enough product quantity available');
        return;
      }
      
      currentItems[itemIndex].quantity = newQuantity;
      this.cartItems.next([...currentItems]);
      this.updateProductQuantity(productId, -quantityDiff);
    }
  }

  private updateProductQuantity(productId: string, quantityChange: number): void {
    const product = this.productService.getProductById(productId);
    if (product) {
      const updatedProduct = { 
        ...product, 
        quantity: Math.max(0, product.quantity + quantityChange)
      };
      this.productService.updateProduct(updatedProduct);
    }
  }

  clearCart(): void {
    const currentItems = this.cartItems.getValue();
    
    // Restore product quantities
    currentItems.forEach(item => {
      this.updateProductQuantity(item.product.id, item.quantity);
    });
    
    this.cartItems.next([]);
  }

  getTotal(): Observable<number> {
    return this._total$;
  }

  ngOnDestroy(): void {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
  }
}