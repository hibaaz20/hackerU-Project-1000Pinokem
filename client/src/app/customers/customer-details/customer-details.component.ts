import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/services/customers.service';
import { Subscription } from 'rxjs';
import { NgxGalleryAnimation, NgxGalleryImage } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {

  customer!: Customer;
  subscription!: Subscription;
 

  constructor(private customerService: CustomersService,
     private route: ActivatedRoute
      ) { }

      ngOnDestroy(): void {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }

  ngOnInit() {
    
    this.route.data.subscribe(data => {
      this.customer = data['customer'];
    });
   }
 
}
