import { Injectable } from '@angular/core';
import { Cart } from 'src/app/shared/models/cart';
import { AuthService } from '../auth/auth.service';
import User from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private cartKey = 'cartItems';

  constructor(private authService: AuthService) {}

  updateCart(cartItems: Cart): void {
    const currentUser: User | null = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('No user is currently logged in.');
      return;
    }
    const storedCart = localStorage.getItem(this.cartKey);
    const preStoredCart: { [key: string]: Cart } = storedCart ? JSON.parse(storedCart) : {};
    preStoredCart[currentUser.userId] = cartItems; 
    localStorage.setItem(this.cartKey, JSON.stringify(preStoredCart));
  }

  getCurrentUserCart(): Cart | null {
    const currentUser: User | null = this.authService.getCurrentUser();
    if (!currentUser) {
      return null;
    }
    const storedCart = localStorage.getItem(this.cartKey);
    const cartData = storedCart ? JSON.parse(storedCart) : {};
    return cartData[currentUser.userId] || {}; 
  }

  getCartItems(): { [userId: string]: Cart } | null {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : null; 
  }

  setCartLocalStorage(cartItems: Cart){
    // let lsCart={};
    // Object.keys(cartItems).map((currKey)=>{
    //   lsCart[currKey]=cartItems[currKey].quantity;
    // })
  }
}
