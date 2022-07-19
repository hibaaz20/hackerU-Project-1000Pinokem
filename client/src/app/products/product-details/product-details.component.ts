import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { Photo } from 'src/app/models/photo';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
 user!: User;
 admin!: Admin;

  product!: Product;
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];
  activeTab!: TabDirective;
  subscription!: Subscription;
  photos!: Photo[];
  quantity = 1;

  currentAdmin$!: Observable<Admin | null>;


  constructor(
    private productService: ProductsService,
    private accountService: AccountService,
    private tastr: ToastrService,
    private route: ActivatedRoute,
    private ordersService: OrdersService
  )
  { 
    this.user = productService.user;  
    this.currentAdmin$ = this.accountService.currentAdmin$;

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {



    this.route.data.subscribe(data => {
      this.product = data['product'];
      this.product.total = this.product.price;
    });

    this.galleryImages = this.getImages();

    this.subscription = this.route.queryParams.subscribe((params: Params) => {
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '700px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
    }];

  }

  getImages(): NgxGalleryImage[] {
    const imgUrls: NgxGalleryImage[] = [];

    if(this.product)
    for (const photo of this.product.productPhotos) {
      imgUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      })
    }
    return imgUrls;
  }



  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    
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


   incQuantity(product: Product){
    this.quantity += 1;
    console.log(product.id + " " + this.quantity);
    product.total = this.quantity * product.price;
}

decQuantity(product: Product){
if(this.quantity > 1){

  this.quantity -= 1;
  product.total = this.quantity * product.price;
  console.log(product.id + " " + this.quantity);


}
}
   

 addOrder(product: Product, event: Event){
  if(this.user == null)
  {
    alert("Sign up or Login to add products to place order")
  }
  else{
  this.ordersService.addOrder(product.id, this.user.userName, this.quantity).subscribe(() => { 
    this.tastr.success("We have recieved your order")
    })
  } 
  event.preventDefault();

}

}

