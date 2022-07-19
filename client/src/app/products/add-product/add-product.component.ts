import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  
  
 
  @Output() cancelRegister = new EventEmitter<boolean>();
  product!: Product;
  productForm!: FormGroup;
  validationErrors: string[] = [];
  
  constructor(private productsService: ProductsService,
    private toaster: ToastrService,
    private router: Router)
    { 
      

    }
    ngOnInit(): void {
      this.initializeForm();
      

    }
  
   
  initializeForm() {
  
     this.productForm = new FormGroup({
      productName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
      productDescription: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
      price: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    });
  }

  addProduct() {
    this.productsService.addProduct(this.productForm?.value).subscribe(
      (re) => {

        this.product = this.productForm.value;
        this.router.navigate(['/add-photos']);

      },
      error => {
        if(Array.isArray(error)) {
          this.validationErrors = error;
        }
      }
    )
    console.log(this.productForm?.value);

  }

  cancel() {
    this.cancelRegister.emit(false);
    this.router.navigate(['/home']);
  }
  
}