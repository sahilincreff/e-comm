import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Papa from 'papaparse'; 

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  productDetails: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const navigationState = history.state;
    if (navigationState && navigationState.productDetails) {
      this.productDetails = navigationState.productDetails;
      this.downloadCSV(); 
    }
  }

  downloadCSV() {
    if (this.productDetails.length === 0) {
      console.log('No product details to download');
      return;
    }
  
    const filteredData = this.productDetails.map(item => ({
      productId: item.productId,  
      quantity: item.quantity      
    }));
  
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
