import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Papa from 'papaparse'; 
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  productDetails: any[] = [];
  isFromCart: boolean=false;

  constructor(private router: Router, private cartService:CartService, private toastService: ToastService) {}

  ngOnInit() {
    const navigationState = history.state;
    if (navigationState && navigationState.productDetails) {
      this.productDetails = navigationState.productDetails;
      this.isFromCart=navigationState.isFromCart;
      this.downloadCSV(); 
    }
    if(this.isFromCart){
      this.cartService.clearCart();
    }
  }

  downloadCSV() {
    if (this.productDetails.length === 0) {
      this.toastService.showToast('No product details to download', 'error')
      return;
    }

    let filteredData;
    if(this.isFromCart){
      filteredData =Object.keys(this.productDetails).map(item => ({
        productId: item, 
        // quantity: this.productDetails[item]
      }));
    }else{
      filteredData = this.productDetails.map(item => ({
        productId: item.productId,  
        quantity: item.quantity      
      }));
    }
  
    const csv = Papa.unparse(filteredData);
  
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'product_details.csv'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
}
