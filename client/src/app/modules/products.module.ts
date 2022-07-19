import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from '../products/product-list/product-list.component';
import { ProductDetailsComponent } from '../products/product-details/product-details.component';
import { ProductDetailesResolver } from '../resolvers/product-detailes.resolver';

const routes: Routes = [
  { path: '', component: ProductListComponent, pathMatch: 'full' },
  {
    path: ':id',
    component: ProductDetailsComponent,
    resolve: {
      product: ProductDetailesResolver
    }
   }
]

@NgModule({
  declarations: [


   
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  
  ],
  exports: [
    RouterModule,
    

  ]
})
export class ProductsModule { }