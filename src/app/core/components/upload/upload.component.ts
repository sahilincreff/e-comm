import { Component, ChangeDetectorRef } from '@angular/core';
import * as Papa from 'papaparse';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { cartItem } from 'src/app/shared/models/cartItem';
import { Product } from 'src/app/shared/models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

export class UploadComponent {
  csvData: any[] = []; 
  productIds: string[] = [];
  productDetails: cartItem[] = [];
  errors: {[key: number]: string} = {};
  selectedFile!: File | null;
  maxAllowedRows = 10;
  shippingCharges: number=50;
  discount:number=100;

  constructor(
    private productService: ProductsService, 
    private cartService: CartService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  handleFileChange(event: any) {
    this.selectedFile = null;
    this.productDetails = [];
    this.errors = {}; 
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv') {
        this.toastService.showToast('Please select CSV Files only', "error");
        return;
      } else {
        this.selectedFile = file;
      }
    } else {
      this.toastService.showToast("Oh no! You didn't select any file", "warning");
    }
  }

  handleUploadClick() {
    if (!this.selectedFile) {
      this.toastService.showToast("Please select a file to upload.", "error");
      return;
    }
    this.errors = [];
    Papa.parse(this.selectedFile, {
      complete: (results: any) => {
        const rows = results.data;
        rows.forEach((rowData: any, index: number) => {
          const productId = rowData.productid;
          let rowQuantity=rowData.quantity;
          if(!rowData.quantity){
            this.errors[0]='There is no column with the header "quantity" present in the CSV';
          }
          if(isNaN(rowQuantity) || (rowQuantity <= 0 || !rowQuantity)){
            if(this.errors[index + 1]){
              this.errors[index + 1] += ", Invalid Product Quantity";
            }else this.errors[index + 1] = "Invalid Product Quantity";
          }
          if (rowQuantity >this.cartService.maxQuantity) {
            if(this.errors[index + 1]){
              this.errors[index + 1] += `, Item Quantity greater than max Allowed Quantity(Max Quantity Allowed ${this.cartService.maxQuantity}`;;
            }else this.errors[index + 1] = this.errors[index + 1] = `Item Quantity greater than max Allowed Quantity(Max Quantity Allowed ${this.cartService.maxQuantity}`;
          }
          if (this.productService.isValidProduct(productId)) {
            this.productService.isValidProduct(productId).subscribe(isValid => {
              if (isValid) {
                this.productService.getProductDetailsFromId([productId]).subscribe(products => {
                  if (products.length > 0) {
                    const productDetail = products[0];  
                    const existingProduct = this.productDetails.find(p => p.productId === productId);
                    if (existingProduct) {
                      existingProduct.quantity += parseInt(rowQuantity)|| 1;
                    } else {
                      this.productDetails.push({
                        ...productDetail,
                        quantity: parseInt(rowQuantity) || 1 
                      });
                    }
  
                    this.cdr.detectChanges();
                  }
                });
              } else {
                if(this.errors[index+1]){
                  this.errors[index + 1] += ', Invalid product ID';
                }else this.errors[index + 1] = 'Invalid product ID';
              }
            });
          } else {
            if(this.errors[index+1]){
              this.errors[index + 1] += ', Product not found';
            }
            this.errors[index + 1] = 'Product not found';
          }
        });
      },
      header: true,
      skipEmptyLines: true,
      transformHeader:function(h) {
        return h.trim().toLowerCase();
      }
    });
  }
  

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  calculateTotalCartPrice() {
    return this.productDetails.reduce((acc, curr) => {
      return acc + (curr.price.sellingPrice * curr.quantity);
    }, 0);
  }

  proceedToCheckout(){
    this.router.navigate(['/checkout'], {
      state: { productDetails: this.productDetails, isFromCart: false}
    });
  }

  mergeWithCartItems() {
    this.cartService.mergeItemsWithCurrentCart(this.productDetails);
  }

  totalUploadedQuantity(){
    return this.productDetails.reduce((acc, curr) => {
      return acc + curr.quantity;
    }, 0);
  }
}
