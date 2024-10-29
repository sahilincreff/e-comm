import { Component } from '@angular/core';
import * as Papa from 'papaparse'
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  csvData: any[] = []; 
  productIds: string[]=[];
  productDetails: Product[]=[];
  constructor(private productService: ProductsService, private cartService: CartService){
    
  }

  handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results: any) => {
          this.csvData = results.data;
          this.productIds = this.csvData
            .filter((row: any) => row.productId)
            .map((row: any) => row.productId);
          this.productDetails = this.productService.getProductDetailsFromId(this.productIds);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  }

  getHeaders() {
    return this.csvData.length > 0 ? Object.keys(this.csvData[0]) : [];
  }

  mergeWithCartItems(){
    this.cartService.mergeWithCurrentCart(this.productDetails);
  }

  replaceWithCartItems(){
    this.cartService.replaceWithCurrentCart(this.productDetails);
  }
}
