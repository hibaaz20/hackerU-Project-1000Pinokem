import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { AdminProfileEditComponent } from './Edit/AdminProfileEdit/admin-profile-edit/admin-profile-edit.component';
import { ProfileEditComponent } from './Edit/CustomerProfileedit/profile-edit/profile-edit.component';
import { AuthGuard } from './guards/auth.guard';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { HomeComponent } from './home/home.component';
import { CustomerOrdersComponent } from './orders/customer-orders/customer-orders.component';
import { MyordersComponent } from './orders/myorders/myorders.component';
import { OrderDetailsComponent } from './orders/order-details/order-details.component';
import { OrdersComponent } from './orders/orders.component';
import { AddPhotosComponent } from './products/add-photos/add-photos.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { RegisterComponent } from './register/register.component';
import { CustomerDetailesResolver } from './resolvers/customer-detailes.resolver';
import { OrdertDetailesResolver } from './resolvers/order-details.resolver';
import { ProductDetailesResolver } from './resolvers/product-detailes.resolver';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  {
  path: '',
  component: HomeComponent,
  pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'products',
        loadChildren: () => import('./modules/products.module').then(m => m.ProductsModule)
      },
      { path: 'customerList', component: CustomerListComponent },
      { path: 'shoppingCart', component: ShoppingCartComponent },
    ]
  },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'add-product', component: AddProductComponent, canActivate: [AuthGuard],
  runGuardsAndResolvers: 'always'},
  
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
  {path: 'myorders', component: MyordersComponent,},
  {path: 'orders/:username', component: CustomerOrdersComponent,  resolve: {customer: CustomerDetailesResolver}},
  {path: 'orderdetails/:orderId', component: OrderDetailsComponent, resolve: {order: OrdertDetailesResolver}},

 
  {path: 'customers', component: CustomerListComponent , pathMatch: 'full'},
  {path: 'customers/:username', component: CustomerDetailsComponent , resolve: {
    customer: CustomerDetailesResolver}},
  
  {path: 'add-photos', component: AddPhotosComponent,  canActivate: [AuthGuard],
  runGuardsAndResolvers: 'always'},
  
  {path: 'profile/edit', component: ProfileEditComponent, canDeactivate: [PreventUnsavedChangesGuard]},
  {path: 'Adminprofile/edit', component: AdminProfileEditComponent},
  {path: 'editProduct/:id', component: ProductEditComponent},
  {path: 'Productdetails/:id', component: ProductDetailsComponent,  resolve: {
    product: ProductDetailesResolver
  }},

  {path: 'about', component: AboutComponent},

   {
     path: '**',
     pathMatch: 'full',
     component: HomeComponent
   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
