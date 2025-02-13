import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin.routes';
import { ProductListComponent } from './components/product-list/product-list.component';

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ]
})
export class AdminModule { }