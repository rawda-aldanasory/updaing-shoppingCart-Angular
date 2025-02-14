import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { DialogService } from '../../../service/dialog.service';
import { CartItem } from '../../../interfaces/cart-item.interface';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  total = 0;
  isProcessing = false;
  checkoutForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9a-zA-Z-\\s]{4,10}$')]],
      country: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[+]?[0-9\\s-()]{8,15}$')]]
    });
  }

  ngOnInit() {
    const cartSub = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/']);
      }
    });
    this.subscriptions.push(cartSub);

    const totalSub = this.cartService.getTotal().subscribe(total => {
      this.total = total;
    });
    this.subscriptions.push(totalSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async onSubmit() {
    if (this.checkoutForm.valid && !this.isProcessing) {
      try {
        this.isProcessing = true;
        
        const confirmed = await this.dialogService.confirm({
          title: 'Confirm Order',
          message: 'Please review your order details before confirming. All information is correct?',
          confirmText: 'Place Order',
          // cancelText: 'Review Order'
        });

        if (confirmed) {
          const order = {
            items: this.cartItems,
            total: this.total,
            shipping: this.checkoutForm.value,
            status: 'pending',
            createdAt: new Date()
          };

          // Simulating API call - in production, replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Success flow
          this.cartService.clearCart();
          this.dialogService.alert({
            title: 'Order Placed',
            message: 'Your order has been successfully placed! A confirmation email has been sent to ' + this.checkoutForm.value.email,
            confirmText: 'OK'
          });
          this.router.navigate(['/order-confirmation'], { state: { orderData: order } });
        } else {
          this.isProcessing = false;
        }
      } catch (error) {
        this.dialogService.alert({
          title: 'Error',
          message: 'There was an error processing your order. Please try again.',
          confirmText: 'OK'
        });
        this.isProcessing = false;
      }
    } else {
      this.markFormGroupTouched(this.checkoutForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.checkoutForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.formatFieldName(controlName)} is required`;
      }
      if (control.errors['minlength']) {
        return `${this.formatFieldName(controlName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        switch (controlName) {
          case 'phone':
            return 'Please enter a valid phone number';
          case 'postalCode':
            return 'Please enter a valid postal code';
          default:
            return 'Invalid format';
        }
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  private formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  updateItemQuantity(itemIndex: number, newQuantity: number) {
    if (newQuantity > 0) {
      this.cartService.updateItemQuantity(this.cartItems[itemIndex].product.id, newQuantity);
    }
  }

  removeItem(itemIndex: number) {
    this.cartService.removeItem(this.cartItems[itemIndex].product.id);
  }

  backToShopping() {
    this.router.navigate(['']);
  }
}