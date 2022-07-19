import { Component, Input, OnInit } from '@angular/core';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { Photo } from 'src/app/models/photo';
import { Product } from 'src/app/models/product';
import { AccountService } from 'src/app/services/account.service';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() product!: Product;

  uploader!: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  baseUrl = environment.apiUrl;
  admin!: Admin;

  constructor(
    private productService: ProductsService,
    private accountService: AccountService
       ) {
    this.accountService.currentAdmin$.pipe(take(1)).subscribe(admin => this.admin = admin as Admin)
  }

  ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader(){
    const options: FileUploaderOptions = {
      url: `${this.baseUrl}products/${this.product.id}/add-photo`,
      authToken: `Bearer ${this.admin.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    }
    this.uploader = new FileUploader(options)

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo:Photo = JSON.parse(response);
        this.product.productPhotos.push(photo);

        if (photo.isMain) {
          this.product.photoUrl = photo.url;
        }
      }



    }
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.productService.setMainPhoto(this.product.id, photo.id).subscribe(() => {
      this.product.photoUrl = photo.url;

      this.product.photoUrl = photo.url;
      this.product.productPhotos.forEach(p => p.isMain = p.id === photo.id);
    })
  }

  deletePhoto(photoId: number) {
    this.productService.deletePhoto(this.product.id,photoId).subscribe(() => {
      this.product.productPhotos = this.product.productPhotos.filter(p => p.id !== photoId);
    });
  }

}

