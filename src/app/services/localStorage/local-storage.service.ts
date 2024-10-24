import { Injectable } from '@angular/core';
import { cartItem } from 'src/app/shared/models/cartItem';
import { Cart } from 'src/app/shared/models/cart';
import { AuthService } from '../auth/auth.service';
import User from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private authService: AuthService) {
    
  }

  getCurrentUserCart(){
    
  }

  updateCart(cartItems: Cart){
    // let currentUserId: User=this.authService.getCurrentUser();
    console.log(cartItems);
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  getCartItems(){
    return localStorage.getItem('cart');
  }

  isUserLoggedIn(): boolean{
    const userData=localStorage.getItem('user');
    return userData ? true : false;
  }
  
}
