import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { Cart } from 'src/app/shared/models/cart';
import { Product } from 'src/app/shared/models/product';
import { cartItem } from 'src/app/shared/models/cartItem';
import * as Papa from 'papaparse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartItems: Cart = {};
  cartItemsList: cartItem[] = [];
  cartClearConfirmation: boolean = false;
  discount: number = 1000;
  shippingCharges: number = 50;
  loading: boolean = true;

  constructor(
    private cartService: CartService,
    private productService: ProductsService,
    private router:Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart updates
    this.cartService.getCartItemsObservable().subscribe(() => {
      this.loadCartItems();
    });
  }

  private loadCartItems(): void {
    // Get cart items from the cart service
    this.cartItems = this.cartService.getCartItems();
    const productIds = Object.keys(this.cartItems);

    if (productIds.length === 0) {
      this.loading = false;
      return;
    }
    this.productService.getProductDetailsFromId(productIds).subscribe((products: Product[]) => {
      this.cartItemsList = products.map(product => {
        return {
          ...product,
          quantity: this.cartItems[product.productId]
        };
      });

      this.loading = false;
    });
  }

  showModal(): void {
    this.cartClearConfirmation = true;
  }

  handleConfirmation(confirmed: boolean): void {
    if (confirmed) {
      this.clearCart();
    }
    this.cartClearConfirmation = false;
  }

  calculateTotalCartPrice(): number {
    return this.cartItemsList.reduce((total, item) => {
      return total + (item.price.sellingPrice * item.quantity);
    }, 0);
  }

  private clearCart(): void {
    this.cartService.clearCart();
    this.cartItemsList = [];
  }

  cartItemsQuantity(): number{
    const products=this.cartService.getCartItems();
    return Object.keys(products).length;
  }

  proceedToCheckout(){
    this.router.navigate(['/checkout'], {
      state: { productDetails: this.cartItems }
    });
  }

}
