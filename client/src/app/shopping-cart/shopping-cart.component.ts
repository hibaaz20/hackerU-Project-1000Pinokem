import { Component, OnInit } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Customer } from '../models/customer';
import { Pagination } from '../models/pagination';
import { Product } from '../models/product';
import { User } from '../models/user';
import { OrdersService } from '../services/orders.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  
  products: Product[] = [];
  items = 0;
  totalSum = 0;
  pageNumber = 1;
  pageSize = 18;
  pagination!:Pagination;
  user!: User;
  customer!: Customer;
  empty: boolean = false;


  constructor(private productService: ProductsService,
            private ordersService: OrdersService,
            private toastr: ToastrService
    ) {    
      this.user = ordersService.user;
     
    }

  ngOnInit() {

    if(this.user)
    {
     this.loadCart();
    
   }
}


loadCart(){
  this.productService.getCart(this.pageNumber, this.pageSize, this.user.userName)
  .subscribe(products => {

    this.products = products.result;
    this.pagination = products.pagination;


    this.products.forEach(x => {
     x.quantity = 1;
     x.total = x.price;
     this.items ++;
     this.totalSum += x.price;

    });

  if(this.items == 0)
  {
    this.empty = true;
  }

  })

 }

 addOrder(products: Product[]){

  if(products.length == 0){
    this.toastr.info("you cart is empty")
  } 

  else{
  products.forEach(product => {
        this.ordersService.addOrder(product.id, this.user.userName, product.quantity).subscribe(() => { 
     })
     this.remove(product);
   });
   this.toastr.success("We have received your order");
   
}
}
    


 loadTotalSum(product: Product){
    this.totalSum += product.price * product.quantity;
 }




  incQuantity(product: Product){
      product.quantity += 1;
      console.log(product.id + " " + product.quantity);
      product.total = product.quantity * product.price;

      this.totalSum += product.price;
  }

  decQuantity(product: Product){
  if(product.quantity > 1){

    product.quantity -= 1;
    product.total = product.quantity * product.price;
    console.log(product.id + " " + product.quantity);
    this.totalSum -= product.price;

  }
  }



 remove(product: Product){
   this.productService.removeProducFromCart(product.id, this.user.userName).subscribe(() => {
     location.reload();
   })
 }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadCart();
  }

}
