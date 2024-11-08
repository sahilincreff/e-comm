import { Component } from '@angular/core';
import * as Papa from 'papaparse';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { cartItem } from 'src/app/shared/models/cartItem';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  csvData: any[] = []; 
  productIds: string[] = [];
  productDetails: cartItem[] = [];
  errors: string[] = [];
  maxAllowedRows = 100;

  constructor(
    private productService: ProductsService, 
    private cartService: CartService
  ) {}

  handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file.type !== 'text/csv') {
      alert('Please select CSV Files Only');
      return;
    }

    if (file) {
      Papa.parse(file, {
        complete: (results: any) => {
          this.csvData = results.data;
          
          if (this.csvData.length > this.maxAllowedRows) {
            alert('File exceeds the maximum row limit');
            return;
          }

          this.productIds = this.csvData
            .filter((row: any) => row.productId)
            .map((row: any) => row.productId);

          const productQuantityMap: { [productId: string]: number } = {};

          this.csvData.forEach((product, i) => {
            if (this.productService.isValidProduct(product.productId)) {
              if (!productQuantityMap[product.productId]) {
                productQuantityMap[product.productId] = 0;
              }

              let quantity = parseInt(product.quantity, 10);
              if (isNaN(quantity) || quantity < 0) {
                this.errors.push(`On row ${i + 1}, ${product.quantity} is not a valid quantity for productId ${product.productId}`);
                return;
              }

              productQuantityMap[product.productId] += quantity;
            } else {
              this.errors.push(`On row ${i + 1}, ${product.productId} is not a valid product Id`);
            }
          });

          this.productService.getProductDetailsFromId(this.productIds).subscribe(
            (details: Product[]) => {
              this.productDetails = details.map(product => {
                const totalQuantity = productQuantityMap[product.productId] || 0;
                const updatedQuantity = totalQuantity > this.cartService.maxQuantity
                  ? this.cartService.maxQuantity
                  : totalQuantity;

                if (updatedQuantity !== totalQuantity) {
                  this.errors.push(`Updated the quantity of ProductId ${product.productId} to the max allowed quantity`);
                }

                return {
                  ...product,
                  quantity: updatedQuantity
                };
              });
            },
            (error) => {
              console.error('Error fetching product details', error);
            }
          );
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  }

  mergeWithCartItems() {
    this.cartService.mergeWithCurrentCart(this.productDetails);
  }

  handleCsvCheckout() {
    this.cartService.replaceWithCurrentCart(this.productDetails);
  }
}
