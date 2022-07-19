import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './shared.module';
import { CustomerDetailsComponent } from '../customers/customer-details/customer-details.component';



const routes: Routes = [
 
  
]

@NgModule({
  declarations: [
    
    CustomerDetailsComponent,
    

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    
  ],
  exports: [
    RouterModule,
 
    CustomerDetailsComponent,
   
  ]
})
export class CustomersModule { }