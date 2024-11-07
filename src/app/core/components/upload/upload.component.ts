import { Component } from '@angular/core';
import * as Papa from 'papaparse'
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
  productIds: string[]=[];
  productDetails: cartItem[]=[];
  errors: string[]=[];
  constructor(private productService: ProductsService, private cartService: CartService){
    
  }

  handleFileChange(event: any) {
    const file = event.target.files[0];
    if(file.type!=='text/csv'){
      alert('Please select CSV Files Only');
      return ;
    }
    if (file) {
      Papa.parse(file, {
        complete: (results: any) => {
          this.csvData = results.data;
          this.productIds = this.csvData
            .filter((row: any) => row.productId)
            .map((row: any) => row.productId);
          this.csvData.map((product, i)=>{
            if(this.productService.isValidProduct(product.productId).subscribe((isValid)=>{
              if(!isValid){
                this.errors.push(`On row ${i+1},  ${product.productId} is not a valid product Id`);
              }
            }))
            if(isNaN(product.quantity) || product.quantity<0){
              this.errors.push(`On row ${i+1},  ${product.quantity} is not a valid product Quantity`);
            }
          })
          this.productService.getProductDetailsFromId(this.productIds).subscribe(
            (details: Product[]) => {
              this.productDetails = details.map(product => {
                const csvRow = this.csvData.find(row => row.productId === product.productId);
                let quantity = csvRow ? parseInt(csvRow.quantity) : 1
                if(isNaN(csvRow.quantity)){
                  this.errors.push(`the quantity you have in your csv file for productId ${csvRow.productId} is Not a number`)
                }
                let updatedQuantity=csvRow.quantity>this.cartService.maxQuantity ? this.cartService.maxQuantity : csvRow.quantity;
                if(parseInt(updatedQuantity)!==quantity ){
                  this.errors.push(`Updated the quantity of Product Id ${csvRow.productId} to max Allowed Quantity`);
                }
                return {
                  ...product,
                  quantity: parseInt(updatedQuantity)
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

  replaceWithCartItems() {
    this.cartService.replaceWithCurrentCart(this.productDetails);
  }
}
