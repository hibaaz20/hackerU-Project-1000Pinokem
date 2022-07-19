import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/models/pagination';
import { Product } from 'src/app/models/product';
import { ProductParams } from 'src/app/models/productParams';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  

  isSearched: boolean = false;
  notFound: boolean = false;

  products: Product[] = [];
  pagination!: Pagination;
  productParams!: ProductParams;
  
  constructor(private productService: ProductsService) {
    this.productParams = this.productService.ProductParams;
   }


  ngOnInit(): void {
   
    this.loadProducts();
  }

  loadProducts(){
    this.productService.ProductParams = this.productParams;
    var input = (document.getElementById("Input") as HTMLInputElement).value;

    if(this.isSearched == false){
    this.productService.getProducts(this.productParams).subscribe(res => {
     
      this.products = res.result;
      this.pagination = res.pagination;
      
      if(this.products.length == 0){
        this.notFound = true;
      }
      else{
        this.notFound = false;
      }
    
    })}

   else{
     this.productService.getSearchedProducts(this.productParams, input).subscribe(res => {
    
      this.products = res.result;
      this.pagination = res.pagination;
     
       
      if(this.products.length == 0){
        this.notFound = true;
      }
      else{
        this.notFound = false;
      }
    })
   }

  }


  pageChanged({ page }: any) {
    this.productParams.pageNumber = page;
    this.productService.ProductParams = this.productParams;
    this.loadProducts();
  }

  resetFilters() { 
    this.isSearched = false;
    this.productParams = this.productService.resetProductParams();
    this.loadProducts();
  }

}


