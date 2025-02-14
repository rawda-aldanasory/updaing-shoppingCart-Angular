import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'cart', component: CartComponent }
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    ProductListComponent, 
    ProductCardComponent,
    CartComponent,
    CommonModule
  ]
})
export class UserModule { }
