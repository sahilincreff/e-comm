import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FiltersService } from 'src/app/services/filters/filters.service';
import Filter from 'src/app/shared/models/filter';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  filters!: Filter;
  selectedFilters: Partial<Filter> = {};

  @Output() filterChange = new EventEmitter<Partial<Filter>>();

  constructor(private filterService: FiltersService) {}

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