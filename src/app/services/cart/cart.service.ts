import { Injectable } from '@angular/core';
import { cartItem } from 'src/app/shared/models/cartItem';
import { Product } from 'src/app/shared/models/product';
import { ProductsService } from '../products/products.service';
import { Cart } from 'src/app/shared/models/cart';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Cart = {};
  private cartItemsSubject = new BehaviorSubject<Cart>(this.cartItems);

  constructor(private productService: ProductsService, private localStorageService: LocalStorageService) {
    const cartItemsString = this.localStorageService.getCartItems();
    // if (cartItemsString && cartItemsString!='null') {
    //   try {
    //     this.cartItems = JSON.parse(cartItemsString);
    //   } catch (error) {
    //     console.error("Error parsing cart items from local storage:", error);
    //     this.cartItems = {};
    //   }
    // }
    this.cartItemsSubject.next(this.cartItems);
  }

  productInCart(productId: string): boolean {
    return !!this.cartItems[productId];
  }

  updateCart(): void {
    this.localStorageService.updateCart(this.cartItems);
    this.cartItemsSubject.next(this.cartItems);
  }

  addProductToCart(productId: string): void {
    this.productService.getProducts().subscribe(products => {
      const product = products.find(singleProduct => singleProduct.productId === productId);
      if (product) {
        const tempObj: cartItem = { ...product, quantity: 1 };
        this.cartItems[productId] = tempObj;
        this.updateCart();
      } else {
        console.error(`Product with ID ${productId} not found.`);
      }
    });
  }

  removeItemFromCart(productId: string): void {
    if (this.cartItems[productId]) {
      delete this.cartItems[productId];
      this.updateCart();
    } else {
      console.warn(`Product with ID ${productId} is not in the cart.`);
    }
  }

  increaseQuantity(productId: string, quantity: number = 1): void {
    if (this.cartItems[productId]) {
      this.cartItems[productId].quantity += quantity;
      this.updateCart();
    } else {
      console.warn(`Product with ID ${productId} is not in the cart.`);
    }
  }

  decreaseQuantity(productId: string, quantity: number = 1): void {
    if (this.cartItems[productId]) {
      if (this.cartItems[productId].quantity - quantity <= 0) {
        this.removeItemFromCart(productId);
      } else {
        this.cartItems[productId].quantity -= quantity;
        this.updateCart();
      }
    } else {
      console.warn(`Product with ID ${productId} is not in the cart.`);
    }
  }

  getCartItems(): Cart {
    return this.cartItems;
  }

  getItemQuantityInCart(productId: string): number {
    return this.cartItems[productId]?.quantity || 0;
  }

  clearCart(): void {
    this.cartItems = {};
    this.updateCart();
  }

  getCartItemsObservable() {
    return this.cartItemsSubject.asObservable();
  }

  mergeWithCurrentCart(productList: Product[]){
    
  }

  replaceWithCurrentCart(ProductList: Product[]){

  }
}
