import { Component, Input } from '@angular/core';
import { Product } from '../../../interfaces/product.interface';
import { CartService } from '../../../service/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  selectedQuantity = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}
  getStockMessage(): string {
    if (this.product.quantity === 0) {
      return 'Out of Stock';
    } else if (this.product.quantity <= 3) {
      return `Only ${this.product.quantity} left!`;
    } else {
      return `Available quantity: ${this.product.quantity}`;
    }
  }

  getStockStatusClass(): string {
    if (this.product.quantity === 0) {
      return 'out-of-stock';
    } else if (this.product.quantity <= 3) {
      return 'low-stock';
    } else {
      return 'in-stock';
    }
  }

  increaseQuantity(): void {
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
    if (this.selectedQuantity > 0 && this.selectedQuantity <= this.product.quantity) {
      this.cartService.addToCart({
        product: this.product,
        quantity: this.selectedQuantity
      });
      this.product.quantity -= this.selectedQuantity;
      this.selectedQuantity = 0;
    }
  }
  

  viewDetails(): void {
    this.router.navigate(['/product', this.product.id]);
  }
}
