import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cartItem } from 'src/app/shared/models/cartItem'; 
import { Product } from 'src/app/shared/models/product';
import { ProductsService } from '../products/products.service';
import { Cart } from 'src/app/shared/models/cart';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { AuthService } from '../auth/auth.service';
import User from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Cart = {};
  private cartItemsSubject = new BehaviorSubject<Cart>(this.cartItems);
  currentUser: User | null = null;
  maxQuantity: number =50;

  constructor(
    private productService: ProductsService,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(() => {
      this.loadCartItems();
    });
    
  }

  private loadCartItems(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userCartItems= this.localStorageService.getCurrentUserCart();
      if (userCartItems) {
        this.cartItems = {...this.cartItems,  ...userCartItems};
      }
    }else{
      const storedCart = sessionStorage.getItem('cart');
      const cartData = storedCart ? JSON.parse(storedCart) : {};
      this.cartItems=cartData;
    }
    this.cartItemsSubject.next(this.cartItems); 
  }

  private updateCart(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.localStorageService.updateCart(this.cartItems);
      this.cartItemsSubject.next(this.cartItems);
    }else{
      sessionStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  addProductToCart(productId: string): void {    
    if (!this.cachedProducts) {
      this.productService.getProducts().subscribe(products => {
        this.cachedProducts = products;
        this.addProductToCartHelper(productId);
      });
    } else {
      this.addProductToCartHelper(productId);
    }
  }

  private cachedProducts: Product[] | null = null;

  private addProductToCartHelper(productId: string): void {
    const product = this.cachedProducts?.find(singleProduct => singleProduct.productId === productId);
    if (product) {
      const tempObj: cartItem = { ...product, quantity: 1 };
      if (!this.cartItems[productId]) {
        this.cartItems[productId] = tempObj; 
      }
      this.updateCart();
    } else {
      console.error(`Product with ID ${productId} not found.`);
    }
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

  productInCart(productId: string): boolean {
    return !!this.cartItems[productId];
  }

  // for upload functionality

  mergeWithCurrentCart(productList: cartItem[]): void {
    for (const product of productList) {
      if (this.cartItems[product.productId]) {
        this.cartItems[product.productId].quantity += product.quantity; 
      } else {
        this.cartItems[product.productId] = { ...product }; 
      }
    }
    this.updateCart();
  }

  replaceWithCurrentCart(newItems: cartItem[]): void {
    this.cartItems = {};
    for (const item of newItems) {
      this.cartItems[item.productId] = { ...item };
    }
    this.updateCart();
  }
}
