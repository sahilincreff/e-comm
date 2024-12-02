import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import User from 'src/app/shared/models/user';
import { cartItem } from 'src/app/shared/models/cartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: { [productId: string]: number } = {};
  private cartItemsSubject: BehaviorSubject<{ [productId: string]: number }> = new BehaviorSubject<{ [productId: string]: number }>(this.cartItems);
  private cartMerged: boolean = false;
  maxQuantity: number = 99;
  private cartLoaded: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) this.handleUserLogin(user);
      else this.loadCartItems();
    });
  }

  private loadCartItems(): void {
    if (this.cartLoaded) return;
    const userCartItems = this.localStorageService.getCurrentUserCart();
    if (userCartItems) this.cartItems = { ...this.cartItems, ...userCartItems };
    this.cartItemsSubject.next(this.cartItems);
    this.cartLoaded = true;
  }

  private handleUserLogin(user: User): void {
    this.mergeGuestCartWithUserCart(user.userId);
  }

  mergeGuestCartWithUserCart(userId: string): void {
    const guestCart = this.localStorageService.getCurrentUserCart();
    if (guestCart) {
      Object.entries(guestCart).forEach(([productId, quantity]) => {
        if (this.cartItems[productId]) this.cartItems[productId] += quantity;
        else this.cartItems[productId] = quantity;
      });
      this.localStorageService.clearGuestCart();
      this.cartMerged = true;
      this.updateCart();
    } else this.loadUserCart(userId);
  }

  loadUserCart(userId: string): void {
    const storedUserCart = this.localStorageService.getCurrentUserCart();
    if (storedUserCart) this.cartItems = { ...this.cartItems, ...storedUserCart };
    else this.cartItems = {};
    this.cartItemsSubject.next(this.cartItems);
  }

  private updateCart(): void {
    this.localStorageService.updateCart(this.cartItems);
    this.cartItemsSubject.next(this.cartItems);
  }

  addProductToCart(productId: string): void {
    if (this.cartItems[productId]) this.cartItems[productId] += 1;
    else this.cartItems[productId] = 1;
    this.updateCart();
  }

  removeItemFromCart(productId: string): void {
    if (this.cartItems[productId]) {
      delete this.cartItems[productId];
      this.updateCart();
    } else console.warn(`Product with ID ${productId} is not in the cart.`);
  }

  increaseQuantity(productId: string, quantity: number = 1): void {
    if (this.cartItems[productId]) {
      const newQuantity = Math.min(this.cartItems[productId] + quantity, this.maxQuantity);
      this.cartItems[productId] = newQuantity;
      this.updateCart();
    } else console.warn(`Product with ID ${productId} is not in the cart.`);
  }

  decreaseQuantity(productId: string, quantity: number = 1): void {
    if (this.cartItems[productId]) {
      const newQuantity = this.cartItems[productId] - quantity;
      if (newQuantity <= 0) this.removeItemFromCart(productId);
      else {
        this.cartItems[productId] = newQuantity;
        this.updateCart();
      }
    } else console.warn(`Product with ID ${productId} is not in the cart.`);
  }

  getCartItems(): { [productId: string]: number } {
    return this.cartItems;
  }

  getItemQuantityInCart(productId: string): number {
    return this.cartItems[productId] || 0;
  }

  clearCart(): void {
    this.cartItems = {};
    this.updateCart();
  }

  productInCart(productId: string): boolean {
    return !!this.cartItems[productId];
  }

  getCartItemsObservable() {
    return this.cartItemsSubject.asObservable();
  }

  mergeItemsWithCurrentCart(products: cartItem[]) {
    let currCartItems = this.cartItems;
    products.map((currProd) => {
      const quantity = parseInt(currProd.quantity.toString(), 10);
      if (currCartItems[currProd.productId]) currCartItems[currProd.productId] += quantity;
      else currCartItems[currProd.productId] = quantity;
    });
    this.cartItems = currCartItems;
    this.updateCart();
  }
}

