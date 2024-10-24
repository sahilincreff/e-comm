import { Component, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent {
  @Input() productId!: string;

  constructor( private cartService: CartService){

  }

  ngOnInit(){
    
  }

  productPresentInCart(){
    if(this.cartService.productInCart(this.productId)){
      return true;
    }
    return false;
  }

  itemQuantityInCart(){
    return this.cartService.getItemQuantityInCart(this.productId);
  }

  decreaseItemQuantity(){
    this.cartService.decreaseQuantity(this.productId);
  }

  increaseItemQuantity(){
    this.cartService.increaseQuantity(this.productId);
  }

  addProductToCart(){
    this.cartService.addProductToCart(this.productId);
  }

  handleProductQuantityClick(event: MouseEvent){
    event.stopPropagation();
  }

}
