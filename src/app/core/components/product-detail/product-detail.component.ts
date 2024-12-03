import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Product } from 'src/app/shared/types/product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product!: Product;
  invalidProduct!: boolean;
  showRemoveConfirmation: boolean = false;

  constructor(private router: ActivatedRoute, private cartService: CartService, private productService: ProductsService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      this.productId = params.get('id');
      this.productService.isValidProduct(this.productId).subscribe(validProduct => {
        if (validProduct) {
          this.productService.getProductDetails(this.productId).subscribe(productDetails => {
            if (productDetails.length > 0) {
              this.product = productDetails[0];
              this.invalidProduct = false;
              console.log(this.product);
            } else {
              console.error('Product not found');
            }
          });
        } else {
          this.invalidProduct = true;
        }
      })
    });
  }

  isValidProduct() {
    return this.productService.isValidProduct(this.productId);
  }

  productQuantityInCart() {
    return this.cartService.getItemQuantityInCart(this.productId || "");
  }

  handleRemoveConfirmation($event: boolean) {
    if ($event) {
      this.cartService.removeItemFromCart(this.productId || "");
      this.toastService.showToast('Item removed from cart', 'success')
    }
    this.showRemoveConfirmation = false;
  }

  removeItemFromCart() {
    this.showRemoveConfirmation = true;
  }
}
