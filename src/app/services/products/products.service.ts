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

  constructor(private http:HttpClient, private filterService: FiltersService) {}

  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsApiUrl);
  }

  setProducts(products: Product[]): void {
    this.products = products;
    this.filteredProducts=this.filterService.updateProductsForFilters(this.products);
  }

  getProducts(): Product[]{
    return this.products;
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
}
