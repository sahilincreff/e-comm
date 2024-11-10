import { Injectable } from '@angular/core';
import { Cart } from 'src/app/shared/models/cart';
import { AuthService } from '../auth/auth.service';
import User from 'src/app/shared/models/user';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private cartKey = 'cartItems';  // Main cart key in localStorage
  private guestCartKey = 'guestCart';  // Separate key for guest cart data

  constructor(
    private authService: AuthService, 
    private toastService: ToastService
  ) {}

  /**
   * Updates the cart in localStorage.
   * If the user is logged in, stores under their user ID, otherwise stores as a guest.
   */
  updateCart(cartItems: { [productId: string]: number }): void {
    const currentUser: User | null = this.authService.getCurrentUser();
    const userID = currentUser?.userId ?? this.guestCartKey; // Use guestCartKey if no user is logged in

    // Get current cart from localStorage
    const storedCartString = localStorage.getItem(this.cartKey);
    const storedCart = storedCartString ? JSON.parse(storedCartString) : {};

    // Add/Update cart for the current user or guest
    storedCart[userID] = cartItems;

    // Save updated cart back to localStorage
    localStorage.setItem(this.cartKey, JSON.stringify(storedCart));
  }

  /**
   * Retrieves the current user's cart from localStorage.
   * If the user is logged in, returns their cart. If not, returns the guest's cart.
   * If there is no cart in localStorage, returns an empty object.
   */
  getCurrentUserCart(): Cart | null {
    const currentUser: User | null = this.authService.getCurrentUser();
    const storedCartString = localStorage.getItem(this.cartKey);

    // Check if the cart exists and if it can be parsed
    if (!storedCartString) {
      return {};  // If no cart exists, return an empty object
    }

    try {
      const storedCart = JSON.parse(storedCartString);
      const userId = currentUser ? currentUser.userId : this.guestCartKey;
      const userCart = storedCart[userId] || {};  // Get the user's or guest's cart

      return userCart;  // Return the cart data as it is stored in localStorage
    } catch (error) {
      // Handle any errors, like corrupted cart data
      this.toastService.showToast('There were some modifications in the Cart stored in local storage, clearing the local storage cart!');
      localStorage.removeItem(this.cartKey);  // Clear localStorage if cart data is invalid
      return {};  // Return an empty object if the data is corrupted
    }
  }

  /**
   * Clears the cart from localStorage.
   */
  clearCart(): void {
    localStorage.removeItem(this.cartKey);
  }

  /**
   * Clears the guest cart from localStorage.
   */
  clearGuestCart(): void {
    const storedCartString = localStorage.getItem(this.cartKey);
    if (storedCartString) {
      try {
        const storedCart = JSON.parse(storedCartString);
        // Only clear the guest cart if it exists
        if (storedCart[this.guestCartKey]) {
          delete storedCart[this.guestCartKey];  // Remove guest cart
          localStorage.setItem(this.cartKey, JSON.stringify(storedCart));  // Save the updated cart
        }
      } catch (error) {
        // If the cart data is corrupted, just clear the entire cart
        localStorage.removeItem(this.cartKey);
      }
    }
  }

  /**
   * Merges the guest cart with the user's cart when the user logs in.
   * This function is called after the user logs in, to combine the guest cart with the user cart.
   */
  mergeGuestCartWithUserCart(userId: string): void {
    const storedCartString = localStorage.getItem(this.cartKey);
    const storedCart = storedCartString ? JSON.parse(storedCartString) : {};

    // If a guest cart exists, merge it with the user's cart
    if (storedCart[this.guestCartKey]) {
      const guestCart = storedCart[this.guestCartKey];

      // If there is no existing cart for the user, create one
      if (!storedCart[userId]) {
        storedCart[userId] = {};
      }

      // Merge guest cart items into user cart
      Object.entries(guestCart).forEach(([productId, quantity]) => {
        if (storedCart[userId][productId]) {
          // If product exists in the user cart, update the quantity
          storedCart[userId][productId] += quantity;
        } else {
          // If product does not exist, add it to the user cart
          storedCart[userId][productId] = quantity;
        }
      });

      // After merging, remove the guest cart from localStorage
      delete storedCart[this.guestCartKey];

      // Save the updated cart back to localStorage
      localStorage.setItem(this.cartKey, JSON.stringify(storedCart));
    }
  }
}
