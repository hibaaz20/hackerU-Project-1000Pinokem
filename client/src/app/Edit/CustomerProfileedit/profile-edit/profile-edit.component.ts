import { AfterContentChecked, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Photo } from 'src/app/models/photo';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { CustomersService } from 'src/app/services/customers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
 
  customer!: Customer;
  user!: User;

  uploader!: FileUploader;
  baseUrl = environment.apiUrl;

  @ViewChild('editForm') editForm!: NgForm
  @ViewChild('securityForm') securityForm!: NgForm

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any){
    if(this.editForm.dirty){
      $event.returnValue = true;
     
    }
    if(this.securityForm.dirty){
      $event.returnValue = true;
     
    }
  }


  constructor(
    private accountService: AccountService,
    private customerService: CustomersService,
    private toastr: ToastrService,
    private router: Router,

  )
   {

      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
       
         this.user = user as User;
 
        } )
      
    }
   


ngOnInit(): void {
 
  this.initializeUploader();
  this.loadCustomer();
}


initializeUploader(){
    
  const options: FileUploaderOptions = {
    url: `${this.baseUrl}users/${this.user.userName}/add-photo`,
    authToken: `Bearer ${this.user.token}`,
    isHTML5: true,
    allowedFileType: ['image'],
    removeAfterUpload: true,
    autoUpload: false,
    maxFileSize: 10 * 1024 * 1024,
  }
  this.uploader = new FileUploader(options)

  this.uploader.onAfterAddingFile = (file) => {
    file.withCredentials = false;
  }

  
  this.uploader.onSuccessItem = (item, response, status, headers) => {
    if (response) {
      const photo:Photo = JSON.parse(response);
      this.customer.photo = photo;

      if (photo.isMain) {
        this.user.photoUrl = photo.url;
        this.customer.photoUrl = photo.url;
        this.accountService.setCurrentUser(this.user);
      }
     
    }

  }
}

loadCustomer() {
  this.customerService.getCustomer(this.user.userName).subscribe(customer => {
    this.customer = customer;
  });
}

updateMember() {
  this.customerService.updateMember(this.user.userName,this.customer).subscribe(() => {
    this.toastr.success("Profile updated successfully");
    this.editForm.reset(this.customer)
  });}

  
  deletePhoto(username: string, id: number) {
    this.customerService.deletePhoto(username,id).subscribe(()=>{
      this.customer.photo.id = id
    
      this.loadCustomer();
    });
  }
  
  logout() {
  
    this.updateMember();
    alert("please login again with your new username")
    this.editForm.reset(this.customer)
    this.accountService.logout();
  
  }

  remove(){
    let sure = confirm("are you sure you want to delete your account?");
      if(sure == true){
        this.customerService.deleteAccount(this.customer.userName).subscribe(() =>{
          this.logout();
          this.toastr.success("account deleted successfully");
          this.router.navigate(['/home'])
          .then(() => {
            window.location.reload();
          });
        });
      }
    }
}




