import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Product } from "../models/product";
import { ProductsService } from "../services/products.service";

@Injectable({
    providedIn: 'root'
  })
  export class ProductDetailesResolver implements Resolve<Product> {
  
    constructor(private productsService:ProductsService) {}
  
    resolve(route: ActivatedRouteSnapshot): Observable<Product> {
        const id = route.paramMap.get('id') as string;
        var productId = parseInt(id);
      return this.productsService.getProduct(productId);
    }
  }