import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Order } from "../models/orders";
import { OrdersService } from "../services/orders.service";

@Injectable({
    providedIn: 'root'
  })
  export class OrdertDetailesResolver implements Resolve<Order> {
  
    constructor(private orderssService: OrdersService) {}
  
    resolve(route: ActivatedRouteSnapshot): Observable<Order> {
        const id = route.paramMap.get('orderId') as string;
        var orderId = parseInt(id);
      return this.orderssService.getOrder(orderId);
    }
  }