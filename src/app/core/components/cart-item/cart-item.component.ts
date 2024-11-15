import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { cartItem } from 'src/app/shared/models/cartItem';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() product!: cartItem;
  removeItemConfirmation: boolean = false;
  deleteIconVisible: boolean = false;

  constructor(private cartService: CartService, private router: Router, private toastService: ToastService) { }

  showDeleteIcon() {
    this.deleteIconVisible = true;
  }

  hideDeleteIcon() {
    this.deleteIconVisible = false;
  }

  toggleItemConfirmation($event: any) {
    this.removeItemConfirmation = !this.removeItemConfirmation;
    $event.stopPropagation();
  }

  handleConfirmation(deleteItem: boolean) {
    if (deleteItem) {
      this.handleItemRemove();
      this.toastService.showToast('Item Removed From Cart', 'warning')
    }
    this.removeItemConfirmation = false;
  }

  productPresentInCart() {
    return this.cartService.productInCart(this.product.productId);
  }

  private handleItemRemove() {
    this.cartService.removeItemFromCart(this.product.productId);
  }

  handleEvent($event: Event) {
    $event.stopPropagation();
  }

}
