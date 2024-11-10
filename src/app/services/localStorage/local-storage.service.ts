import { Injectable } from '@angular/core';
import { Cart } from 'src/app/shared/models/cart';
import { AuthService } from '../auth/auth.service';
import User from 'src/app/shared/models/user';
import { ToastService } from '../toast/toast.service';
import { ProductsService } from '../products/products.service';
import { map, catchError } from 'rxjs/operators';
import { Observable, of} from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private cartKey = 'cartItems';
  guestCartKey="guestCart"

  constructor(private authService: AuthService, private toastService: ToastService, private productService: ProductsService) {}

  updateCart(cartItems: Cart): void {
    const currentUser: User | null = this.authService.getCurrentUser();
    const userID = currentUser?.userId ?? this.guestCartKey;
    const localCart = Object.fromEntries(
      Object.entries(cartItems).map(([productId, { productId: id, quantity }]) => [
        id, quantity
      ])
    );
    const storedCart = localStorage.getItem(this.cartKey);
    const preStoredCart = storedCart ? JSON.parse(storedCart) : {};
    preStoredCart[userID] = localCart;
    localStorage.setItem(this.cartKey, JSON.stringify(preStoredCart));
  }
  
  

  getCurrentUserCart(): Observable<Cart | null> {
    const currentUser: User | null = this.authService.getCurrentUser();
    const preStoredCartString = localStorage.getItem(this.cartKey) || "";
    try {
      const preStoredCart = JSON.parse(preStoredCartString);
      const userId = currentUser ? currentUser.userId : this.guestCartKey;
      const userCart = preStoredCart[userId] || {};
      const productIds: string[] = Object.keys(userCart);
      if (productIds.length === 0) {
        return of({});
      }
      return this.productService.getProductDetailsFromId(productIds).pipe(
        map((productDetails) => {
          const cartItems: Cart = {};
          productDetails.forEach((currProd) => {
            cartItems[currProd.productId] = { 
              ...currProd, 
              quantity: userCart[currProd.productId] 
            };
          });
          return cartItems;
        }),
        catchError((error) => {
          console.error("Error fetching product details:", error);
          this.toastService.showToast('Error loading cart items. Please try again later.');
          return of(null);
        })
      );
    } catch (error) {
      this.toastService.showToast('There were some modifications in the Cart stored in the local storage, clearing the local storage cart!');
      localStorage.removeItem(this.cartKey);
      return of(null);
    }
  }
}
