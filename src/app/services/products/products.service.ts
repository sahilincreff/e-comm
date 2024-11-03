import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
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
    this.filterService.getFiltersUpdates().subscribe(() => {
      this.filteredProducts = this.filterService.updateProductsForFilters(this.products);
      this.productsSubject.next(this.filteredProducts);
    });
  }

  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsApiUrl).pipe(
      map((data: Product[]) => {
        this.setProducts(data); // Set the fetched products
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
    this.filteredProducts = this.filterService.updateProductsForFilters(this.products);
    this.productsSubject.next(this.filteredProducts);
  }

  getProducts(): Observable<Product[]> {
    if (this.products.length === 0) {
      // Fetch products if the list is empty
      return this.fetchProducts();
    } else {
      return this.productsSubject.asObservable();
    }
  }

  isValidProduct(productId: string | null): boolean {
    return this.products.some(product => product.productId === productId);
  }

  getProductDetails(productId: string | null): Observable<Product[]> {
    if (this.products.length === 0) {
      // Fetch products if the list is empty before filtering
      return this.fetchProducts().pipe(
        map(() => this.products.filter(product => product.productId === productId))
      );
    } else {
      return new Observable<Product[]>(observer => {
        observer.next(this.products.filter(product => product.productId === productId));
        observer.complete();
      });
    }
  }

  getFilteredProducts(): Product[] {
    return this.filteredProducts;
  }

  getProductDetailsFromId(productIds: string[]): Product[] {
    return this.products.filter(product => productIds.includes(product.productId));
  }
}
