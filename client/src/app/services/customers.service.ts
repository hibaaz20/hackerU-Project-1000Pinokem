import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer';
import { PaginatedResult } from '../models/pagination';
import { User } from '../models/user';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationParams } from './paginationHelper';

  

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  baseUrl = environment.apiUrl;
  customers: Customer[] = [];
  customer!: Customer;
  user!: User;
  userParams!: UserParams;

  customerCache = new Map<string, PaginatedResult<Customer[]>>();

  constructor(private http: HttpClient,
    private accountService: AccountService
    ) {
    accountService.currentUser$
      .pipe(take(1))
      .subscribe((user: any) => {
        this.user = user;
        this.userParams = new UserParams();
      });
   }



  
  public get UserParams(): UserParams {
    return this.userParams
  }

  public set UserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  resetUserParams() {
    this.userParams = new UserParams();
    return this.userParams;
  }

  getCustomers(userParams: UserParams): Observable<PaginatedResult<Customer[]>> {
    const cacheKey = Object.values(userParams).join('-');
    const response = this.customerCache.get(cacheKey);
    if (response) return of(response);

    let params = getPaginationParams(userParams.pageNumber, userParams.pageSize);
     params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Customer[]>(`${this.baseUrl}users`, params, this.http)
      .pipe(
        tap(res => this.customerCache.set(cacheKey, res))
      );
  }
  


  getCustomer(username: string): Observable<Customer>{
 
    return this.http.get<Customer>(this.baseUrl + `users/` + username)
  }

  updateMember(username: string, customer: Customer) {
    return this.http.put(this.baseUrl + `users/` + username, customer).pipe(
    tap(_ => {
      const index = this.customers.findIndex(x => x.id === customer.id);
      this.customers[index] = customer;
    })
  )
    
  }

  deleteAccount(username: string) {
    return this.http.delete(this.baseUrl + `users/delete-account/` + username);
  }

  deletePhoto(username: string, photoId: number) {
    return this.http.delete(this.baseUrl + `users/${username}/delete-photo/${photoId}`);
  }


  getSearchedCustomers(userParams: UserParams, input: string): Observable<PaginatedResult<Customer[]>> {
    const cacheKey = Object.values(userParams).join('-');
    const response = this.customerCache.get(cacheKey);
    if (response) return of(response);

    let params = getPaginationParams(userParams.pageNumber, userParams.pageSize);
     params = params.append('input', userParams.input);

    return getPaginatedResult<Customer[]>(this.baseUrl + `users/search/` + input, params, this.http)
      .pipe(
        tap(res => this.customerCache.set(cacheKey, res))
      );
  }

 
}
