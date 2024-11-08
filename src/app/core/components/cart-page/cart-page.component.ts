import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { cartItem } from 'src/app/shared/models/cartItem';
import { Cart } from 'src/app/shared/models/cart';
import { BehaviorSubject } from 'rxjs';
import * as Papa from 'papaparse'

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartItems: Cart = {};
  cartItemsList: cartItem[] = [];
  cartClearConfirmation: boolean=false;
  discount: number=1000;
  shippingCharges: number=50;

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

  private clearCart(): void {
    this.cartService.clearCart();
    this.cartItemsList=[];
  }

  handleCartCheckout(){
    const headers = [
        "productId",
        "quantity"
    ];

    const csvData = Object.values(this.cartItems).map((item: cartItem) => [
        item.productId,
        item.quantity
    ]);
    const data = [headers, ...csvData];
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'cart_items.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
