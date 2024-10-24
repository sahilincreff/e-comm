import { Injectable } from '@angular/core';
import { cartItem } from 'src/app/shared/models/cartItem';
import { Cart } from 'src/app/shared/models/cart';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  updateCart(cartItems: Cart){
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
