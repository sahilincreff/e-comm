import { Component } from '@angular/core';
import * as Papa from 'papaparse';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ToastService } from 'src/app/services/toast/toast.service';
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
  errors: {[key: number]: string} ={2:"Invalid quantity", 3: "invalid productid"};
  selectedFile!: File;
  maxAllowedRows = 10;

  constructor(
    private productService: ProductsService, 
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  handleFileChange(event: any) {
    const file = event.target.files[0];
    if(file){
      if(file.type !== 'text/csv') {
        this.toastService.showToast('Please select CSV Files only')
        return;
      }else{
        this.selectedFile=file
      }
    }else{
      this.toastService.showToast("Oh no! You didn't selected any file");
    }
  }

  // handleUploadClick(){
  //   Papa.parse(this.selectedFile, {
  //     complete: (results: any) => {
  //       if(results.data.length>this.maxAllowedRows){
  //         this.toastService.showToast('This csv file has more then max allowed rows');
  //       }else{
  //         let validProducts:{[key:string]:number}={};
  //         results.data.map((rowData)=>{
  //           if(this.productService.isValidProduct(rowData.productId) && this.isValidQuantity(rowData.quantity)){
  //             validProducts.push()
  //           }
  //         })
  //         if(Object.keys(validProducts).length!==results.data.length){
  //           this.toastService.showToast('Please Check you CAV files for the following Errors', 'error', 3000);
  //         }else{

  //         }
  //       }
  //     },
  //     header: true,
  //     skipEmptyLines: true,
  //   });
  // }

  hasErrors(): boolean{
    return Object.keys(this.errors).length>0;
  }

  // validateItemsAndQuantity(csvData): boolean{
  //   let validatedProducts:{[key: number]: string}={};
  //   csvData.map((rowData)=>{
  //     let validProductId: boolean=this.productService.isValidProduct(rowData.productId) || false;
  //     let validProductQuantity: boolean=this.isValidQuantity(rowData.quantity);

  //   })
  // }

  isValidQuantity(quantity: number): boolean{
    if(isNaN(quantity)) return false;
    return true;
  }

  mergeWithCartItems() {
    this.cartService.mergeWithCurrentCart(this.productDetails);
  }
}
