import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { Product } from 'src/app/shared/models/product';
import { Router } from '@angular/router';
import { FiltersService } from 'src/app/services/filters/filters.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  filteredProducts: Product[] = [];

  constructor(
    private productService: ProductsService,
    private router: Router,
    private filterService: FiltersService
  ) { }

  ngOnInit(): void {
    this.productService.getFilteredProducts().subscribe(
      (filteredProducts) => {
        this.filteredProducts = filteredProducts;
      },
      (error) => {
        console.error('Error fetching filtered products:', error);
      }
    );
    
    this.productService.fetchProducts().subscribe(
      (data) => {
        this.productService.setProducts(data); 
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  openProductDetails(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  removeSearchFilters() {
    this.filterService.clearSelectedFilters(); 
  }
}
