import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { Admin } from 'src/app/models/admin';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  user!: User;
  @Input() isInCart: boolean = false;
  currentAdmin$!: Observable<Admin | null>;

  constructor(
    private productService: ProductsService,
    private accountService: AccountService,
    private tastr: ToastrService,
  )
  { 
    this.user = productService.user;  
    this.currentAdmin$ = this.accountService.currentAdmin$;
  }


  ngOnInit(): void {
  }


  addToCart(product: Product, event: Event){
   if(this.user == null)
   {
     alert("Sign up or Login to add products to your cart")
   }
   else{
    this.productService.addToCart(product.id, this.user.userName)
    .subscribe(() => {
      this.tastr.success(`Product Added To Your Cart`);
  })}
   event.preventDefault();
  }
  
  removeFromCart(product: Product,username: string){
   
    this.productService.removeProducFromCart(product.id, username)
    .subscribe(() => {
      this.tastr.success(`Product remove from yout cart`);
      window.location.reload();
       })
  }
  

}
