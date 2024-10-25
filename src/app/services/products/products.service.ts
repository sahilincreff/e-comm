import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, catchError, map, throwError} from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { FiltersService } from '../filters/filters.service';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  private productsApiUrl='assets/constants/products.json';
  private products: Product[]=[];
  private filteredProducts: Product[]=[];
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http:HttpClient, private filterService: FiltersService) {
    this.filterService.getFiltersUpdates().subscribe(() => {
      this.filteredProducts = this.filterService.updateProductsForFilters(this.products);
      this.productsSubject.next(this.filteredProducts);
    });
  }

  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsApiUrl);
  }

  setProducts(products: Product[]): void {
    this.products = products;
    this.filteredProducts = this.filterService.updateProductsForFilters(this.products);
    this.productsSubject.next(this.filteredProducts);
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  // getProducts(): Observable:<any>

  // ngOnInit(){
  //   this.http.get(this.productsApiUrl).subscribe({
  //     next: (data) => {
  //       console.log(data);
  //     }
  //   })
  // }

  isValidProduct(productId: string | null){
    // this.products.map((product)=>{
    //   if(product.productId==productId){
    //     return true;
    //   }
    // })
    // return false;
    return true;
  }

  getProductDetails(productId: string | null){
    return this.products.filter((product)=>product.productId===productId)
  }

  getFilteredProducts(){
    return this.filteredProducts;
  }

  getProductDetailsFromId(productIds: string[]): Product[]{
    let products: Product[]=[];
    for(let product  of this.products){
      if(productIds.includes(product.productId)){
        products.push(product);
      }
    }
    return products;
  }
}
