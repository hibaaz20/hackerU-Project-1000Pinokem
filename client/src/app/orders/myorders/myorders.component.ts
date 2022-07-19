import { Component, Input, OnInit } from '@angular/core';
import { OrdersParams } from 'src/app/models/orderParams';
import { Order } from 'src/app/models/orders';
import { Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css']
})
export class MyordersComponent implements OnInit {
 

  orders: Order[] = [];
  ordersParams!: OrdersParams;
  pagination!: Pagination;
  user!: User;

  constructor(private orderservice: OrdersService,
     ) {
       this.user = orderservice.user;
       this.ordersParams = this.orderservice.OrdersParams;
   }


  ngOnInit(): void {
      this.loadOrders()
  }


 loadOrders(){
   
    this.orderservice.OrdersParams = this.ordersParams;
 
    if(this.user){
    this.orderservice.getUserOrders(this.ordersParams.pageNumber,this.ordersParams.pageSize, this.user.userName).subscribe(res => {
      this.orders = res.result;
      this.pagination = res.pagination; 
      
         this.orders.forEach(x => {
        x.total = x.product.price * x.quantity;
     })
    })}

}

  pageChanged({ page }: any) {
    this.ordersParams.pageNumber = page;
    this.orderservice.OrdersParams = this.ordersParams;
    this.loadOrders();
  }
}
