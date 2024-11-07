import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localStorage/local-storage.service';
import Filter from 'src/app/shared/models/filter';
import { ProductsService } from '../products/products.service';
import { FILTERS } from 'src/assets/constants/filters';
import { Product } from 'src/app/shared/models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filters!:Filter;
  private selectedFilters: Partial<Filter> = {};
  private filterSubject = new BehaviorSubject<any>(this.selectedFilters);

  constructor() {
    this.filters = FILTERS;
    const prevSelectedFilters = sessionStorage.getItem('filters');
    if (prevSelectedFilters) {
      this.selectedFilters = JSON.parse(prevSelectedFilters);
      this.filterSubject.next(this.selectedFilters); 
    }
  }

  updateFilter() {
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
    this.filterSubject.next(this.selectedFilters);
    this.updateFilter();
  }

  getFiltersUpdates() {
    return this.filterSubject.asObservable();
  }

  updateProductsForFilters(products: Product[]): Product[]{
    if(this.isEmptyFilter()){
      return products;
    }
    let filteredProducts: Product[] = [];
    for(let product of products){
      if((this.selectedFilters['brands']?.includes(product.brand) || (this.selectedFilters['brands']?.length==0) || (!this.selectedFilters['brands'])) &&
        (this.selectedFilters['processor']?.includes(product.processor) || (this.selectedFilters['processor']?.length==0) || (!this.selectedFilters['processor'])) && 
        (!this.selectedFilters['battery'] || (Array.isArray(this.selectedFilters['battery']) && product.battery<=Math.max(...this.selectedFilters['battery'])) || this.selectedFilters['battery'].length==0) &&
        (this.selectedFilters['connectivity']?.includes(product.connectivity) || (this.selectedFilters['connectivity']?.length==0 || !this.selectedFilters['connectivity'])) &&
        (!this.selectedFilters['price'] || (Array.isArray(this.selectedFilters['price']) && product.price.sellingPrice<=Math.max(...this.selectedFilters['price'])) || this.selectedFilters['price'].length==0)
      ){
        filteredProducts.push(product);
      }
    }
    return filteredProducts;
  }

  isEmptyFilter(): boolean{
    for (const singleFilter of Object.keys(this.selectedFilters) as (keyof Filter)[]) {
      if (this.selectedFilters[singleFilter]?.length !== 0) {
        return false;
      }
    }
    return true;
  }

  clearSelectedFilters(): void {
    this.selectedFilters = {};
    sessionStorage.removeItem('filters');
    this.filterSubject.next(this.selectedFilters);
  }
}
