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
        this.products=this.productService.getProducts();
        this.filteredProducts=this.filterService.updateProductsForFilters(this.products);
        console.log(this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  filterProducts(){
    // this.filterProducts=this.filterService.getFilteredProducts();
  }

  openProductDetails(productId: string){
    this.router.navigate(['/product', productId]);
  }
}
