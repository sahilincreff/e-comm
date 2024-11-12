import { Injectable } from '@angular/core';
import { Cart } from 'src/app/shared/models/cart';
import { AuthService } from '../auth/auth.service';
import User from 'src/app/shared/models/user';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private cartKey = 'cartItems';  
  private guestCartKey = 'guestCart';

  constructor(
    private authService: AuthService, 
    private toastService: ToastService
  ) {}

  updateCart(cartItems: { [productId: string]: number }): void {
    const currentUser: User | null = this.authService.getCurrentUser();
    const userID = currentUser?.userId ?? this.guestCartKey; 
    const storedCartString = localStorage.getItem(this.cartKey);
    const storedCart = storedCartString ? JSON.parse(storedCartString) : {};
    storedCart[userID] = cartItems;
    localStorage.setItem(this.cartKey, JSON.stringify(storedCart));
  }

  getCurrentUserCart(): Cart | null {
    const currentUser: User | null = this.authService.getCurrentUser();
    const storedCartString = localStorage.getItem(this.cartKey);

    if (!storedCartString) return {};  

    try {
      const storedCart = JSON.parse(storedCartString);
      const userId = currentUser ? currentUser.userId : this.guestCartKey;
      const userCart = storedCart[userId] || {};  

      return userCart; 
    } catch (error) {
      this.toastService.showToast('There were some modifications in the Cart stored in local storage, clearing the local storage cart!', "error");
      localStorage.removeItem(this.cartKey); 
      return {}; 
    }
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
  }

  clearGuestCart(): void {
    const storedCartString = localStorage.getItem(this.cartKey);
    if (storedCartString) {
      try {
        const storedCart = JSON.parse(storedCartString);
        if (storedCart[this.guestCartKey]) {
          delete storedCart[this.guestCartKey];
          localStorage.setItem(this.cartKey, JSON.stringify(storedCart)); 
        }
      } catch (error) {
        localStorage.removeItem(this.cartKey);
      }
    }
  }

  mergeGuestCartWithUserCart(userId: string): void {
    const storedCartString = localStorage.getItem(this.cartKey);
    const storedCart = storedCartString ? JSON.parse(storedCartString) : {};
    if (storedCart[this.guestCartKey]) {
      const guestCart = storedCart[this.guestCartKey];
      if (!storedCart[userId]) {
        storedCart[userId] = {};
      }

      Object.entries(guestCart).forEach(([productId, quantity]) => {
        if (storedCart[userId][productId]) {
          storedCart[userId][productId] += quantity;
        } else {
          storedCart[userId][productId] = quantity;
        }
      });
      delete storedCart[this.guestCartKey];
      localStorage.setItem(this.cartKey, JSON.stringify(storedCart));
    }
  }
}
