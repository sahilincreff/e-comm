import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FiltersService } from 'src/app/services/filters/filters.service';
import { ProductsService } from 'src/app/services/products/products.service';
import Filter from 'src/app/shared/models/filter';
import { FILTERS } from 'src/assets/constants/filters';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  filters!: Filter;
  selectedFilters: Partial<Filter> = {};

  @Output() filterChange = new EventEmitter<Partial<Filter>>();

  constructor(private filterService: FiltersService, private productService: ProductsService) {
    this.productService.fetchProducts().subscribe(
      (products) => {
        const filters: Filter = {
          brands: [],
          processor: [],
          price: [Infinity, -Infinity],
          connectivity: [],
          battery: [Infinity, -Infinity], 
          category: [],
        };

        products.forEach((product) => {
          if (!filters.brands.includes(product.brand)) {
            filters.brands.push(product.brand);
          }
          if (!filters.processor.includes(product.processor)) {
            filters.processor.push(product.processor);
          }

          if (!filters.connectivity.includes(product.connectivity)) {
            filters.connectivity.push(product.connectivity);
          }

          filters.battery[0] = Math.min(filters.battery[0], product.battery);
          filters.battery[1] = Math.max(filters.battery[1], product.battery); 
        });
        this.filters = filters;
        this.filters.price=FILTERS.price;
        this.filterChange.emit(this.filters);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  ngOnInit() {
    this.filters = this.filterService.getFilters();
    this.selectedFilters = this.filterService.getSelectedFilters();
    this.filterService.getFiltersUpdates().subscribe(filters => {
      this.selectedFilters = filters;
    });
  }

  onCheckboxChange(filter: keyof Filter, value: string | number) {
    if (!this.selectedFilters[filter]) {
      this.selectedFilters[filter] = [];
    }
    const index = (this.selectedFilters[filter] as (string | number)[]).indexOf(value);
    if (index === -1) {
      (this.selectedFilters[filter] as (string | number)[]).push(value);
    } else {
      (this.selectedFilters[filter] as (string | number)[]).splice(index, 1);
    }
    this.filterService.setSelectedFilter(this.selectedFilters);
  }

  isChecked(filter: keyof Filter, value: string | number): boolean {
    const currFilter = this.selectedFilters[filter];
    return Array.isArray(currFilter) && currFilter.map(String).includes(String(value));
  }

  getFilters(filterType: keyof Filter) {
    return this.filters[filterType];
  }

  handleClearFilter() {
    this.filterService.clearSelectedFilters();
    this.selectedFilters = {}; 
  }

  nofilterApplied(){
    return this.filterService.isEmptyFilter();
  }
}