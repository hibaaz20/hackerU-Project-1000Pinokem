import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { OrdersParams } from 'src/app/models/orderParams';
import { Order } from 'src/app/models/orders';
import { Pagination } from 'src/app/models/pagination';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent implements OnInit {

  
  orders: Order[] = [];
  ordersParams!: OrdersParams;
  pagination!: Pagination;
  customer!: Customer;
  subscription!: Subscription;
  
  constructor(private orderservice: OrdersService,  
    private route: ActivatedRoute,
     )
    {
      this.ordersParams = this.orderservice.OrdersParams;
   }

   ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    
    this.route.data.subscribe(data => {
      this.customer = data['customer'];
      this.loadOrders()
    });
    
  }


 loadOrders(){
   
    this.orderservice.OrdersParams = this.ordersParams;
 
   
    this.orderservice.getUserOrders(this.ordersParams.pageNumber,this.ordersParams.pageSize, this.customer.userName).subscribe(res => {
      this.orders = res.result;
      this.pagination = res.pagination; 
      
         this.orders.forEach(x => {
        x.total = x.product.price * x.quantity;
     })
    })

}

  pageChanged({ page }: any) {
    this.ordersParams.pageNumber = page;
    this.orderservice.OrdersParams = this.ordersParams;
    this.loadOrders();
  }
}
