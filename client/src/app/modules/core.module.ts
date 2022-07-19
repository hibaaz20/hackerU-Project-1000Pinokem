import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    
  ],
  exports: [
    BsDropdownModule,
    
  ],

  declarations: []
})
export class CoreModule { }
