import { Component, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { cartItem } from 'src/app/shared/models/cartItem';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() product!:cartItem;

  constructor(private cartService: CartService){
    
  }

  ngOnInit(){
    
  }

  productPresentInCart(){
    return this.cartService.productInCart(this.product.productId);
  }

  handleItemRemove(){
    this.cartService.removeItemFromCart(this.product.productId);
  }

}
