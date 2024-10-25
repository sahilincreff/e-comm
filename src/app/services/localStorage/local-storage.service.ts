import { Injectable } from '@angular/core';
import { cartItem } from 'src/app/shared/models/cartItem';
import { Cart } from 'src/app/shared/models/cart';
import { AuthService } from '../auth/auth.service';
import User from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(private authService: AuthService) {}

  getCurrentUserCart(): Cart | null {
    const currentUser: User | null = this.authService.getCurrentUser();
    if (!currentUser) {
      return null;
    }
    const storedCart = localStorage.getItem('cart');
    const cartData = storedCart ? JSON.parse(storedCart) : {};
    return cartData[currentUser.userId] || null; 
  }

  updateCart(cartItems: Cart) {
    const currentUser: User | null = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('No user is currently logged in.');
      return;
    }
    const storedCart = localStorage.getItem('cart');
    const preStoredCart: { [key: string]: Cart } = storedCart ? JSON.parse(storedCart) : {};  
    preStoredCart[currentUser.userId] = cartItems;
    localStorage.setItem('cart', JSON.stringify(preStoredCart));
  }
  

  getCartItems(): Cart | null {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : null; 
  }

  currentLoggedInUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
}
