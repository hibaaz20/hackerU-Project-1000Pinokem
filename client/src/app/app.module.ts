import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './modules/core.module';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from './modules/shared.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ProductListComponent } from './products/product-list/product-list.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomersModule } from './modules/customers.module';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { ProfileEditComponent } from './Edit/CustomerProfileedit/profile-edit/profile-edit.component';
import { AdminProfileEditComponent } from './Edit/AdminProfileEdit/admin-profile-edit/admin-profile-edit.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductCardComponent } from './products/product-card/product-card.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { AddPhotosComponent } from './products/add-photos/add-photos.component';
import { PhotoEditorComponent } from './products/product-edit/photo-editor/photo-editor.component';
import { OrdersComponent } from './orders/orders.component';
import { MyordersComponent } from './orders/myorders/myorders.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CustomerOrdersComponent } from './orders/customer-orders/customer-orders.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { OrderDetailsComponent } from './orders/order-details/order-details.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    ShoppingCartComponent,
    ProductListComponent,
    CustomerListComponent,
    ProductEditComponent,
    ProfileEditComponent,
    AdminProfileEditComponent,
    ProductCardComponent,
    AddProductComponent,
    AddPhotosComponent,
    PhotoEditorComponent,
    OrdersComponent,
    MyordersComponent,
    ProductDetailsComponent,
    CustomerOrdersComponent,
    FooterComponent,
    AboutComponent,
    OrderDetailsComponent
    
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    CustomersModule,
    NgxSpinnerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
