import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Customer } from 'src/app/models/customer';
import { Pagination } from 'src/app/models/pagination';
import { UserParams } from 'src/app/models/userParams';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  pagination!: Pagination;
  userParams!: UserParams;
  filterdUsers: Customer[] = [];

  isSearched: boolean = false;
  notFound: boolean = false;

  constructor(private customerService: CustomersService) {
    this.userParams = this.customerService.UserParams;
   }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(){
    this.customerService.UserParams = this.userParams;
    var input = (document.getElementById("Input") as HTMLInputElement).value;

    if(this.isSearched == false){
    this.customerService.getCustomers(this.userParams).subscribe(res => {
     
      this.customers = res.result;
      this.pagination = res.pagination;
      
      if(this.customers.length == 0){
        this.notFound = true;
      }
      else{
        this.notFound = false;
      }
    
    })}

   else{
     this.customerService.getSearchedCustomers(this.userParams, input).subscribe(res => {
    
      this.customers = res.result;
      this.pagination = res.pagination;
     
       
      if(this.customers.length == 0){
        this.notFound = true;
      }
      else{
        this.notFound = false;
      }
    })
   }

  }


  pageChanged({ page }: any) {
    this.userParams.pageNumber = page;
    this.customerService.UserParams = this.userParams;
    this.loadCustomers();
  }


}
