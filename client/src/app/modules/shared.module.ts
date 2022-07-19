import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { CustomerCardComponent } from '../customers/customer-card/customer-card.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FileUploadModule } from 'ng2-file-upload';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@NgModule({
  imports: [
    
    CommonModule,
    RouterModule,
    NgxGalleryModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot()
    
  ],
  declarations: [
    CustomerCardComponent,
    
    
  ],
  exports:[
    ButtonsModule,
    BsDropdownModule,
    ToastrModule,
    BsDropdownModule,
    CustomerCardComponent,
    NgxGalleryModule,
    TabsModule,
    FileUploadModule,
    PaginationModule,
  ]
})
export class SharedModule { }