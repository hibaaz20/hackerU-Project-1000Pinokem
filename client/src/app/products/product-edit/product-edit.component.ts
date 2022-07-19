import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  product!: Product;
  @ViewChild('editForm') editForm!: NgForm

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any){
    if(this.editForm.dirty){
      $event.returnValue = true;
     
    }
  }
  constructor(private productService: ProductsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    ){}

    productForm!: FormGroup;
    validationErrors: string[] = [];
 
  ngOnInit() {
    
    this.route.data.subscribe(data => {
      this.product = data['product'];

      this.loadProduct();
      this.initializeForm();
    });
   }
 
   initializeForm() {
  
    this.productForm = new FormGroup({
     productName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
     productDescription: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
     price: new FormControl('', [Validators.required, Validators.max(5000)]),
   });
 }

   loadProduct(){
    const stringId = this.route.snapshot.paramMap.get('id') as string;
    var id = parseInt(stringId);
    this.productService.getProduct(id).subscribe(product => this.product = product);
  }

  updateProduct() {
    console.log(this.product.id)
    this.productService.updateProduct(this.product.id,this.productForm?.value).subscribe(() => {
      this.toastr.success("Product updated successfully");
    });}

    remove(){
    let sure = confirm("are you sure you want to delete this product?");
      if(sure == true){
        this.productService.deleteProduct(this.product.id).subscribe(() =>{
          this.toastr.success("Product deleted successfully");
          this.router.navigate(['/home'])
          .then(() => {
            window.location.reload();
          });
        });
      }
    }
  
  }




