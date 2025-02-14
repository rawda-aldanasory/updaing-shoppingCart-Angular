import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../service/cart.service';
import { CartItem } from '../../../interfaces/cart-item.interface';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.getTotal().subscribe(total => {
      this.total = total;
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  updateItemQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0 && newQuantity <= item.product.quantity) {
      this.cartService.updateItemQuantity(item.product.id, newQuantity);
    }
  }
  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
    const index = this.cartItems.findIndex(item => item.product.id === productId);
    if (index!== -1) {
      this.cartItems.splice(index, 1);
    }
    this.cartService.getTotal();
  }

}