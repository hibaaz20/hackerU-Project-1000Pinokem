import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, ReplaySubject, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdersParams } from '../models/orderParams';
import { Order } from '../models/orders';
import { PaginatedResult } from '../models/pagination';
import { Product } from '../models/product';
import { User } from '../models/user';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationParams } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
   
  order!: Order;
  user!: User;
  
  baseUrl = environment.apiUrl;
  orderCache = new Map<string, PaginatedResult<Order[]>>();
  products: Product[] = [];

  private currentProductSource$ = new ReplaySubject<Product | null>(1);
  currentProduct$ = this.currentProductSource$.asObservable();

  ordersParams!: OrdersParams;

  constructor(private http: HttpClient,
     private accountService: AccountService
    ) {
      accountService.currentUser$
      .pipe(take(1))
      .subscribe((user: any) => {
          this.user = user;
          this.ordersParams = new OrdersParams();
      });

      
   }
      

  public get OrdersParams(): OrdersParams {
    return this.ordersParams
  }

  public set OrdersParams (orderParams: OrdersParams) {
    this.ordersParams = orderParams;
  }


  getOrders(orderParams: OrdersParams): Observable<PaginatedResult<Order[]>> {
    const cacheKey = Object.values(orderParams).join('-');
    const response = this.orderCache.get(cacheKey);
    if (response) return of(response);

    let params = getPaginationParams(orderParams.pageNumber, orderParams.pageSize);
     params = params.append('orderBy', orderParams.orderBy);

    return getPaginatedResult<Order[]>(`${this.baseUrl}orders`, params, this.http)
      .pipe(
        tap(res => this.orderCache.set(cacheKey, res))
      );
  }
  


  getOrder(id: number): Observable<Order>{
 
    return this.http.get<Order>(`${this.baseUrl}orders/${id}`).pipe(
      tap(res => this.order = res)
    )
  }


    
  addOrder(productId: number, username: string, quantity: number) {
    const url = `${this.baseUrl}orders?` + `username=${username}&productId=${productId}&quantity=${quantity}`;
    return this.http.post(url , {});
  }
  
  
  getUserOrders(pageNumber: number, pageSize: number, username: string) {

    let params = getPaginationParams(pageNumber, pageSize);

    return getPaginatedResult<Order[]>(`${this.baseUrl}orders/${username}/orders?username=${username}`, params, this.http)

  }

  
  cancelOrder(orderId: number, username: string) {
    return this.http.delete(`${this.baseUrl}orders/remove-order/${orderId}?` + `username=${username}`);
  }


}



