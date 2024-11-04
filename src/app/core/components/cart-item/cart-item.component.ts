import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { cartItem } from 'src/app/shared/models/cartItem';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() product!:cartItem;
  removeItemConfirmation: boolean = false;

  constructor(private cartService: CartService, private router: Router){
    
  }

  toggleItemConfirmation(){
    this.removeItemConfirmation=!this.removeItemConfirmation;
  }

  handleConfirmation(deleteItem: boolean){
    if(deleteItem){
      this.handleItemRemove();
    }
    this.removeItemConfirmation=false;
  }

  ngOnInit(){
    
  }

  productPresentInCart(){
    return this.cartService.productInCart(this.product.productId);
  }

  handleItemRemove(){
    this.cartService.removeItemFromCart(this.product.productId);
  }

  openProductDetails(){
    this.router.navigate(['/product', this.product.productId]);
  }

}
