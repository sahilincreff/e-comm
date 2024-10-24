import { Component, Output, EventEmitter} from '@angular/core';
import { FiltersService } from 'src/app/services/filters/filters.service';
import { FILTERS } from '../../../../assets/constants/filters';
import Filter from 'src/app/shared/models/filter';
import { ProductsService } from 'src/app/services/products/products.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  filters!:Filter;
  selectedFilters: Partial<Filter>={};

  @Output() filterChange = new EventEmitter<Partial<Filter>>();

  constructor(private filterService: FiltersService, private productsService: ProductsService){
    this.filters=this.filterService.getFilters();
    this.selectedFilters=this.filterService.getSelectedFilters();
  }

  onCheckboxChange(filter: keyof Filter, value: string | number){
      if(!this.selectedFilters[filter]){
        this.selectedFilters[filter]=[]; 
      }
      const index=(this.selectedFilters[filter] as (string | number)[]).indexOf(value);
      if(index===-1){
        (this.selectedFilters[filter] as (string | number)[]).push(value);
      }else{
        (this.selectedFilters[filter] as (string | number)[]).splice(index, 1);
      }
      console.log(this.selectedFilters);
      this.filterService.setSelectedFilter(this.selectedFilters);
  }

  isChecked(filter: keyof Filter, value: string | number): boolean{
    const currFilter=this.selectedFilters[filter];
    if(Array.isArray(currFilter)){
      currFilter.map(String).includes(String(value));
    }
    return false;
  }

  getFilters(filterType: keyof Filter){
    return this.filters[filterType];
  }

  handleSortingChange(greater: boolean){
    // this.productsService.sortProducts(greater);
  }

  handleClearFilter(){
    this.filterService.clearSelectedFilters();
  }
}
