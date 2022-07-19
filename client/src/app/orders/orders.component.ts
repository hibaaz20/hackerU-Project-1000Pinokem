import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrdersParams } from '../models/orderParams';
import { Order } from '../models/orders';
import { Pagination } from '../models/pagination';
import { OrdersService } from '../services/orders.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];
  ordersParams!: OrdersParams;
  pagination!: Pagination;
  subscription!: Subscription;

  constructor(private orderservice: OrdersService) {
    this.ordersParams = this.orderservice.OrdersParams;
   }


  

  ngOnInit(): void {
      this.loadOrders()
  }


 loadOrders(){
    this.orderservice.OrdersParams = this.ordersParams;
  
    this.orderservice.getOrders(this.ordersParams).subscribe(products => {
      this.orders = products.result;

      this.orders = products.result;
      this.pagination = products.pagination;
  
  
      this.orders.forEach(x => {
       x.total = x.product.price * x.quantity;
    })})
  }

  pageChanged({ page }: any) {
    this.ordersParams.pageNumber = page;
    this.orderservice.OrdersParams = this.ordersParams;
    this.loadOrders();
  }
}
