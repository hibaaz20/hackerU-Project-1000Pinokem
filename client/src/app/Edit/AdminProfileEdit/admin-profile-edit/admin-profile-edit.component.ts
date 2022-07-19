import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { adminRepository } from 'src/app/models/adminRepository';
import { Photo } from 'src/app/models/photo';
import { AccountService } from 'src/app/services/account.service';
import { AdminsService } from 'src/app/services/admins.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-profile-edit',
  templateUrl: './admin-profile-edit.component.html',
  styleUrls: ['./admin-profile-edit.component.css']
})
export class AdminProfileEditComponent implements OnInit {

  adminRepository!: adminRepository;
  admin!:Admin;
  
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
    private adminService: AdminsService,
    private toastr: ToastrService
  )
  { 
    this.accountService.currentAdmin$.pipe(take(1)).subscribe(admin => {
       this.admin = admin as Admin;
    })
  }

  ngOnInit(): void {
    this.initializeUploader();
    this.loadAdmin();
  }

  
loadAdmin() {
  this.adminService.getAdmin(this.admin.userName).subscribe(admin => {
    this.adminRepository = admin;
  });
}


initializeUploader(){
    
  const options: FileUploaderOptions = {
    url: `${this.baseUrl}admins/${this.admin.userName}/add-photo`,
    authToken: `Bearer ${this.admin.token}`,
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
      this.adminRepository.photo = photo;

      if (photo.isMain) {
        this.admin.photoUrl = photo.url;
        this.adminRepository.photoUrl = photo.url;
        this.accountService.setCurrentAdmin(this.admin);
      }
     
    }

  }
}


updateAdmin() {
  this.adminService.updateAdmin(this.admin.userName,this.adminRepository).subscribe(() => {
    this.toastr.success("Profile updated successfully");
    this.editForm.reset(this.adminRepository)
  });}

  
  deletePhoto(username: string, id: number) {
    this.adminService.deletePhoto(username,id).subscribe(()=>{
      this.adminRepository.photo.id = id
    
      this.loadAdmin();
    });

  
   
  }
  
  logout() {
  
    this.updateAdmin();
    alert("please login again with your new username")
    this.editForm.reset(this.adminRepository)
    this.accountService.adminLogout();
  
  }

}
