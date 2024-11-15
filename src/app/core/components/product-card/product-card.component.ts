import { Component, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private cartService: CartService) {

  }

  handleProductCardHover() {

  }

  isProductInCart(productId: string) {
    return this.cartService.productInCart(productId);
  }

  handleQuantityClick($event: Event) {
    $event.stopPropagation();
  }
}
