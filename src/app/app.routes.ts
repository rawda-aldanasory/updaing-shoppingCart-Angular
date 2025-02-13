import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard'; 
import { LoginComponent } from './components/login/login.component';
import { ProductDetailsComponent } from './user/components/product-details/product-details.component';
import { CheckoutComponent } from './user/components/checkout/checkout.component';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, adminGuard] 
  },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
];
