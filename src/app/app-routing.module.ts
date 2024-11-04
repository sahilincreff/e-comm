import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCardComponent } from './core/components/product-card/product-card.component';
import { ProductsListComponent } from './core/components/products-list/products-list.component';
import { CartPageComponent } from './core/components/cart-page/cart-page.component';
import { UploadComponent } from './core/components/upload/upload.component';
import { ProductDetailComponent } from './core/components/product-detail/product-detail.component';
import { Page404Component } from './core/components/page404/page404.component';
import { LoginComponent } from './core/components/login/login.component';
import { HomeComponent } from './core/components/home/home.component';
import { CheckoutComponent } from './core/components/checkout/checkout.component';
import { LoginGuard } from './services/auth/login.guard';

const routes: Routes = [
  { path:'',
    component: HomeComponent
  },
  { path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'upload',
    component: UploadComponent
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard] 
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: '**',
    component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
