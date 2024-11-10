import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit, OnDestroy {
  @Input() productId!: string;
  quantityInCart: number = 0;
  private cartSubscription!: Subscription;
  showRemoveConfirmation: boolean = false;
  maxItemsToast: boolean = false;
  @Input() productDetailPage: boolean=false;

  constructor(private cartService: CartService, private toastService: ToastService) {}

  ngOnInit() {
    this.cartSubscription = this.cartService.getCartItemsObservable().subscribe(() => {
      this.updateQuantity();
    });
  
    this.updateQuantity();
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

  decreaseItemQuantity(): void {
    const currentQuantity = this.cartService.getItemQuantityInCart(this.productId);
    if (currentQuantity === 1) {
      this.showRemoveConfirmation = true;
    } else {
      this.cartService.decreaseQuantity(this.productId);
      this.toastService.showToast('Item Removed Successfully', 'success', 2000);
    }
  }

  removeConfirmation(confirmation: boolean): void {
    if (confirmation) {
      this.cartService.removeItemFromCart(this.productId);
      this.toastService.showToast('Item Removed Successfully', 'success', 2000);
    }
    this.showRemoveConfirmation = false;
  }

  increaseItemQuantity(): void {
    const currentQuantity = this.cartService.getItemQuantityInCart(this.productId);
    if (currentQuantity >= this.cartService.maxQuantity) {
      this.maxItemsToast = true;
      setTimeout(() => {
        this.maxItemsToast = false;
      }, 3000);
    } else {
      this.cartService.increaseQuantity(this.productId);
    }
  }

  addProductToCart(): void {
    this.cartService.addProductToCart(this.productId);
  }

  handleProductQuantityClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  private updateQuantity(): void {
    this.quantityInCart = this.cartService.getItemQuantityInCart(this.productId);
  }

  removeItemFromCart(){
    this.showRemoveConfirmation=true;
  }
}
