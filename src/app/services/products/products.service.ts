import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError, BehaviorSubject, of } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { FiltersService } from '../filters/filters.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsApiUrl = 'assets/constants/products.json';
  private products: Product[] = [];
  private filteredProducts: Product[] = [];  
  private productsSubject = new BehaviorSubject<Product[]>([]);  
  private filteredProductsSubject = new BehaviorSubject<Product[]>([]);  
  private loadingSubject = new BehaviorSubject<boolean>(false); 

  constructor(private http: HttpClient, private filterService: FiltersService) {
    this.fetchProducts().subscribe();
    this.filterService.getFiltersUpdates().subscribe(() => {
      this.applyFilters();  
    });
  }

  fetchProducts(): Observable<Product[]> {
    if (this.products.length) {
      return of(this.products); 
    }

    if (this.loadingSubject.getValue()) {
      return this.productsSubject.asObservable();  
    }

    this.loadingSubject.next(true);

    return this.http.get<Product[]>(this.productsApiUrl).pipe(
      map((data: Product[]) => {
        this.setProducts(data); 
        this.loadingSubject.next(false);  
        return data;
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching products', error);
        return throwError(error);
      })
    );
  }

  refreshProducts() {
    this.products = []; 
    this.fetchProducts().subscribe();
  }

  setProducts(products: Product[]): void {
    this.products = [...products]; 
    this.productsSubject.next([...this.products]);
    this.applyFilters(); 
  }

  applyFilters(): void {
    this.filteredProducts = this.filterService.updateProductsForFilters([...this.products]);  
    this.filteredProductsSubject.next([...this.filteredProducts]);  
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable(); 
  }

  getFilteredProducts(): Observable<Product[]> {
    return this.filteredProductsSubject.asObservable(); 
  }

  isValidProduct(productId: string | null): Observable<boolean> {
    return this.fetchProducts().pipe(
      map(() => this.products.some(product => product.productId === productId))
    );
  }

  getProductDetails(productId: string | null): Observable<Product[]> {
    return this.fetchProducts().pipe(
      map(() => this.products.filter(product => product.productId === productId))
    );
  }

  getProductDetailsFromId(productIds: string[]): Observable<Product[]> {
    return this.fetchProducts().pipe(
      map(() => this.products.filter(product => productIds.includes(product.productId)))
    );
  }
}
