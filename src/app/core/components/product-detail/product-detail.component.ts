import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: string | null=null;
  product!: Product;

  constructor(private router: ActivatedRoute, private cartService: CartService, private productService: ProductsService){
    
  }

  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.productService.getProductDetails(this.productId).subscribe(productDetails => {
          if (productDetails.length > 0) {
            this.product = productDetails[0];
          } else {
            console.error('Product not found');
          }
        });
      }
    });
  }

  isValidProduct(){
    return this.productService.isValidProduct(this.productId);
  }
}
