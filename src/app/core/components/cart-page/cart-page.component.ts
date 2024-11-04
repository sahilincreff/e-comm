import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { cartItem } from 'src/app/shared/models/cartItem';
import { Cart } from 'src/app/shared/models/cart';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartItems: Cart = {};
  cartItemsList: cartItem[] = [];
  cartClearConfirmation: boolean=false;

  constructor(private cartService: CartService) {

  }

  ngOnInit() {
    this.cartService.getCartItemsObservable().subscribe(()=>{
      this.cartItems = this.cartService.getCartItems();
      this.cartItemsList = Object.values(this.cartItems);
    })
  }

  showModal() {
    this.cartClearConfirmation = true;
  }

  handleConfirmation(confirmed: boolean) {
    if (confirmed) {
      this.clearCart();
    }
    this.cartClearConfirmation = false;
  }

  calculateTotalCartPrice(): number {
    return Object.values(this.cartItems).reduce((total, product) => {
      return total + (product.price.sellingPrice * product.quantity);
    }, 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItemsList=[];
  }
}
