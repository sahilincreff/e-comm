import { Component } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { Product } from 'src/app/shared/models/product';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { FiltersService } from 'src/app/services/filters/filters.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent {
  products: Product[] =[];
  filteredProducts: Product[]=[];

  constructor(private productService: ProductsService, private router: Router, private filterService: FiltersService){
    
  }

  ngOnInit(){
    this.productService.fetchProducts().subscribe(
      (data) => {
        this.productService.setProducts(data);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );

    this.productService.getProducts().subscribe(filteredProducts => {
      this.filteredProducts = filteredProducts;
      console.log(this.filteredProducts); 
    });
  }

  

  openProductDetails(productId: string){
    this.router.navigate(['/product', productId]);
  }
}
