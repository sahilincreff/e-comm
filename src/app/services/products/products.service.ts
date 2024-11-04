import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError, BehaviorSubject } from 'rxjs';
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

  constructor(private http: HttpClient, private filterService: FiltersService) {
    this.fetchProducts().subscribe();
    this.filterService.getFiltersUpdates().subscribe(() => {
      this.applyFilters();
    });
  }

  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsApiUrl).pipe(
      map((data: Product[]) => {
        this.setProducts(data); 
        return data;
      }),
      catchError(error => {
        console.error('Error fetching products', error);
        return throwError(error);
      })
    );
  }

  setProducts(products: Product[]): void {
    this.products = products;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredProducts = this.filterService.updateProductsForFilters(this.products);
    this.productsSubject.next(this.filteredProducts); 
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  isValidProduct(productId: string | null): boolean {
    return this.products.some(product => product.productId === productId);
  }

  getProductDetails(productId: string | null): Observable<Product[]> {
    return this.fetchProducts().pipe(
      map(() => this.products.filter(product => product.productId === productId))
    );
  }

  getFilteredProducts(): Product[] {
    return this.filteredProducts;
  }

  getProductDetailsFromId(productIds: string[]): Observable<Product[]> {
    return this.fetchProducts().pipe(
      map(() => this.products.filter(product => productIds.includes(product.productId)))
    );
  }
}
