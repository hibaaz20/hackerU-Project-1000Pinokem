import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/orders';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  order!: Order;
  subscription!: Subscription;
  
  constructor(private orderservice: OrdersService,  
    private route: ActivatedRoute)  
    {
    }
   

   ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.order = data['order'];
      this,this.order.total = this.order.product.price * this.order.quantity
    });
    
  }


}
