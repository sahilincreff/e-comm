import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { ProductCardComponent } from './core/components/product-card/product-card.component';
import { ProductsListComponent } from './core/components/products-list/products-list.component';
import { HttpClientModule } from '@angular/common/http'
import { AddToCartComponent } from './core/components/add-to-cart/add-to-cart.component';
import { CarouselComponent } from './core/components/carousel/carousel.component';
import { ProductDetailComponent } from './core/components/product-detail/product-detail.component';
import { CartItemComponent } from './core/components/cart-item/cart-item.component';
import { CartPageComponent } from './core/components/cart-page/cart-page.component';
import { FiltersComponent } from './core/components/filters/filters.component';
import { LoginComponent } from './core/components/login/login.component';
import { Page404Component } from './core/components/page404/page404.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './core/components/home/home.component';
import { UploadComponent } from './core/components/upload/upload.component';
import { ModalComponent } from './core/components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    AddToCartComponent,
    CarouselComponent,
    ProductDetailComponent,
    CartItemComponent,
    CartPageComponent,
    FiltersComponent,
    LoginComponent,
    Page404Component,
    HomeComponent,
    ProductsListComponent,
    UploadComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
