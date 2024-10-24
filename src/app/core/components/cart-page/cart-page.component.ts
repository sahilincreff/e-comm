import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { cartItem } from 'src/app/shared/models/cartItem';
import { Cart } from 'src/app/shared/models/cart';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent {
  cartItems: Cart={}
  cartItemsList: cartItem[]=[];

  constructor(private cartService:CartService){
    this.cartItems=this.cartService.getCartItems();
    Object.keys(this.cartItems).map((singleItem)=>{
      this.cartItemsList.push(this.cartItems[singleItem]);
    })
  }

  calculateTotalCartPrice(){
    let currentTotal=0;
    Object.keys(this.cartItems).map((item)=>{
      const product=this.cartItems[item];
      currentTotal+=((product.price.sellingPrice)*product.quantity);
    })
    return currentTotal;
  }

  clearCart(){
    this.cartService.clearCart();
  }

}
