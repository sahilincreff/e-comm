import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit, OnDestroy {
  @Input() productId!: string;
  quantityInCart: number = 0;
  private cartSubscription!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.updateQuantity(); 
    this.cartSubscription = this.cartService.getCartItemsObservable().subscribe(() => {
      this.updateQuantity();
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  productPresentInCart(): boolean {
    return this.cartService.productInCart(this.productId);
  }

  itemQuantityInCart(): number {
    return this.cartService.getItemQuantityInCart(this.productId);
  }

  decreaseItemQuantity() {
    this.cartService.decreaseQuantity(this.productId);
  }

  increaseItemQuantity() {
    this.cartService.increaseQuantity(this.productId);
  }

  addProductToCart() {
    this.cartService.addProductToCart(this.productId);
  }

  handleProductQuantityClick(event: MouseEvent) {
    event.stopPropagation();
  }

  private updateQuantity() {
    this.quantityInCart = this.cartService.getItemQuantityInCart(this.productId);
  }
}
