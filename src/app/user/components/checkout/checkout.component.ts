import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { DialogService } from '../../../service/dialog.service';
import { CartItem } from '../../../interfaces/cart-item.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  isProcessing = false;
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
      country: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]]
    });
  }

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/']);
      }
    });

    this.cartService.getTotal().subscribe(total => {
      this.total = total;
    });
  }

  async onSubmit() {
    if (this.checkoutForm.valid) {
      try {
        const confirmed = await this.dialogService.confirm({
          title: 'Confirm Order',
          message: 'Are you sure you want to place this order?',
          confirmText: 'Place Order'
        });

        if (confirmed) {
          this.isProcessing = true;
          
          const order = {
            items: this.cartItems,
            total: this.total,
            shipping: this.checkoutForm.value,
            status: 'pending',
            createdAt: new Date()
          };

          await new Promise(resolve => setTimeout(resolve, 1500));
          
          this.cartService.clearCart();
          this.router.navigate(['/']);
          
          this.dialogService.alert({
            title: 'Order Placed',
            message: 'Your order has been successfully placed!',
            confirmText: 'OK'
          });
          
        }
      } catch (error) {
        this.dialogService.alert({
          title: 'Error',
          message: 'There was an error processing your order. Please try again.',
          confirmText: 'OK'
        });
      } finally {
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
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      }
      if (control.errors['minlength']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
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
    }
    return '';
  }
}