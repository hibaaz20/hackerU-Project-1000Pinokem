import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Customer } from "../models/customer";
import { CustomersService } from "../services/customers.service";

@Injectable({
    providedIn: 'root'
  })
  export class CustomerDetailesResolver implements Resolve<Customer> {
  
    constructor(private customerService:CustomersService) {}
  
    resolve(route: ActivatedRouteSnapshot): Observable<Customer> {
        const username = route.paramMap.get('username') as string;
      return this.customerService.getCustomer(username);
    }
  }