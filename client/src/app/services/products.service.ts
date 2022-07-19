import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, ReplaySubject, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../models/pagination';
import { Product } from '../models/product';
import { ProductParams } from '../models/productParams';
import { User } from '../models/user';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationParams } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  product!: Product;
  user!: User;
  baseUrl = environment.apiUrl;
  productCache = new Map<string, PaginatedResult<Product[]>>();
  products: Product[] = [];

  private currentProductSource$ = new ReplaySubject<Product | null>(1);
  currentProduct$ = this.currentProductSource$.asObservable();

  productParams!: ProductParams;

  constructor(private http: HttpClient,
     private accountService: AccountService
    ) {
      accountService.currentUser$
      .pipe(take(1))
      .subscribe((user: any) => {
        this.user = user;
        this.productParams = new ProductParams();
      });

     
   }
      


  addProduct(model: any){
    return this.http.post<Product>(this.baseUrl + 'products/add-product', model)
      .pipe(
        map((product : Product) => {
          if(product){
          localStorage.setItem('product', JSON.stringify(product));
          this.currentProductSource$.next(product);
        }
        return product;
      })
    )
}

  
  public get ProductParams(): ProductParams {
    return this.productParams
  }

  public set ProductParams(productParams: ProductParams) {
    this.productParams = productParams;
  }

  resetProductParams() {
    this.productParams = new ProductParams();
    return this.productParams;
  }


  getProducts(productParams: ProductParams): Observable<PaginatedResult<Product[]>> {
    const cacheKey = Object.values(productParams).join('-');
    const response = this.productCache.get(cacheKey);
    if (response) return of(response);

    let params = getPaginationParams(productParams.pageNumber, productParams.pageSize);
     params = params.append('orderBy', productParams.orderBy);
     params = params.append('MinPrice', productParams.MinPrice);
     params = params.append('MaxPrice', productParams.MaxPrice);


    return getPaginatedResult<Product[]>(`${this.baseUrl}products`, params, this.http)
      .pipe(
        tap(res => this.productCache.set(cacheKey, res))
      );
  }
  

  getSearchedProducts(productParams: ProductParams, input: string): Observable<PaginatedResult<Product[]>> {
    const cacheKey = Object.values(productParams).join('-');
    const response = this.productCache.get(cacheKey);
    if (response) return of(response);

    let params = getPaginationParams(productParams.pageNumber, productParams.pageSize);
    params = params.append('orderBy', productParams.orderBy);
    params = params.append('MinPrice', productParams.MinPrice);
    params = params.append('MaxPrice', productParams.MaxPrice);
    params = params.append('input', productParams.input);

    return getPaginatedResult<Product[]>(`${this.baseUrl}products/search/${input}`, params, this.http)
      .pipe(
        tap(res => this.productCache.set(cacheKey, res))
      );
  }
  

  getProduct(id: number): Observable<Product>{
 
    return this.http.get<Product>(`${this.baseUrl}products/${id}`).pipe(
      tap(res => this.product  = res)
    )
  }

  deleteProduct(productId: number) {
    return this.http.delete(`${this.baseUrl}products/delete-product/${productId}`);
  }

  updateProduct(id: number, product: Product) {
    const url = `${this.baseUrl}products/${id}?` + `id=${id}`;
    return this.http.put(url ,product)
     
  }


  deletePhoto(productId: number, photoId: number) {
   const url = (`${this.baseUrl}products/delete-photo/${photoId}?` + `productId=${productId}`);
   return this.http.delete(url, {});
  }

  
    
  addToCart(productId: number, username: string) {
    const url = `${this.baseUrl}cart/${productId}?` + `username=${username}`;
    return this.http.post(url , {});
  }
  
  
  getCart(pageNumber: number, pageSize: number, username: string) {

    let params = getPaginationParams(pageNumber, pageSize);
    const url = `${this.baseUrl}cart?` + `username=${username}`;

    return getPaginatedResult<Product[]>(url ,params, this.http)
  }

  
  removeProducFromCart(id: number, username: string) {
    return this.http.delete(`${this.baseUrl}cart/remove-product/${id}?username=${username}`);
  }


  setMainPhoto(productId: number, photoId: number): Observable<any> {
  return this.http.put(`${this.baseUrl}products/set-main-photo/${photoId}?productId=${productId}`, {});
  }

 
}



