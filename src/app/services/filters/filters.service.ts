import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localStorage/local-storage.service';
import Filter from 'src/app/shared/models/filter';
import { ProductsService } from '../products/products.service';
import { FILTERS } from 'src/assets/constants/filters';
import { Product } from 'src/app/shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filters!:Filter;
  private selectedFilters: Partial<Filter> = {};

  constructor() {
    this.filters=FILTERS;
    const prevSelectedFilters=sessionStorage.getItem('filters');
    // this.selectedFilters=JSON.parse(prevSelectedFilters);
    console.log(prevSelectedFilters);
  }

  updateFilter(){
    sessionStorage.setItem('filters', JSON.stringify(this.selectedFilters));
  }

  ngOnInit(){
    
  }

  getFilters(){
    return this.filters;
  }

  getSelectedFilters(){
    return this.selectedFilters;
  }

  setSelectedFilter(selectedFilters: Partial<Filter>): void {
    this.selectedFilters=selectedFilters;
    console.log(this.selectedFilters);
    this.updateFilter();
  }

  updateProductsForFilters(products: Product[]): Product[]{
    if(this.selectedFilters==null){
      return products;
    }
    // let filteredProducts: Product[] = [];
    // if (!this.selectedFilters || !this.selectedFilters['brands']) {
    //   return products;
    // }
    // const selectedBrands = new Set(this.selectedFilters['brands'].map(brand => brand.toLowerCase()));
    // for (let product of products) {
    //   if (selectedBrands.has(product.brand.toLowerCase())) {
    //     filteredProducts.push(product);
    //   }
    // }
    return products;
  }

  clearSelectedFilters(){
    this.selectedFilters={};
  }
}
