import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/product.interface';
import { CartService } from '../../../service/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  selectedQuantity = 0;
  isAddingToCart = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.product) {
      console.error('Product card initialized without a product!');
    }
  }

  getStockMessage(): string {
    if (!this.product) return '';
    
    if (this.product.quantity <= 0) {
      return 'Out of Stock';
    } else if (this.product.quantity <= 3) {
      return `Only ${this.product.quantity} left!`;
    } else {
      return `Available quantity: ${this.product.quantity}`;
    }
  }

  getStockStatusClass(): string {
    if (!this.product) return '';
    
    if (this.product.quantity <= 0) {
      return 'out-of-stock';
    } else if (this.product.quantity <= 3) {
      return 'low-stock';
    } else {
      return 'in-stock';
    }
  }

  increaseQuantity(): void {
    if (!this.product) return;
    
    if (this.selectedQuantity < this.product.quantity) {
      this.selectedQuantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.selectedQuantity > 0) {
      this.selectedQuantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;
    
    if (this.selectedQuantity > 0 && this.selectedQuantity <= this.product.quantity) {
      this.isAddingToCart = true;
      
      try {
        this.cartService.addToCart({
          product: { ...this.product },
          quantity: this.selectedQuantity
        });
        this.selectedQuantity = 0;
      } catch (error) {
        console.error('Error adding product to cart:', error);
      } finally {
        this.isAddingToCart = false;
      }
    }
  }

  viewDetails(): void {
    if (!this.product) return;
    this.router.navigate(['/product', this.product.id]);
  }

  isOutOfStock(): boolean {
    return this.product?.quantity <= 0;
  }
}