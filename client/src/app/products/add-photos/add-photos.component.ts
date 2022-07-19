import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Subscription, take } from 'rxjs';
import { Photo } from 'src/app/models/photo';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-photos',
  templateUrl: './add-photos.component.html',
  styleUrls: ['./add-photos.component.css']
})
export class AddPhotosComponent implements OnInit {

  @Input() product!: Product;
  uploader!: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  baseUrl = environment.apiUrl;
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];
  @ViewChild('productTabs', {static: true}) productabs!: TabsetComponent;
  activeTab!: TabDirective;
  messages: Message[] = [];
  subscription!: Subscription;


  @Output() cancelRegister = new EventEmitter<boolean>();

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.productsService.currentProduct$.pipe(take(1)).subscribe(product => this.product = product as Product)
  }

  ngOnInit() {

    this.initializeUploader();

    this.loadProduct();
   

}

reloadHome(){
  this.router.navigate(['/home'])
  .then(() => {
    window.location.reload();
  });
}


  onTabActivated(data: TabDirective) {
    this.activeTab = data;
  }


  selectTab(tabId: number) {
    this.productabs.tabs[tabId].active = true;
  }


  
  loadProduct() {
    this.productsService.getProduct(this.product.id).subscribe(product => {
      this.product = product;
    });
  }
  


  initializeUploader(){

    const options: FileUploaderOptions = {
      url: `${this.baseUrl}products/${this.product.id}/add-photo`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: true,
      maxFileSize: 10 * 1024 * 1024,
      
    }
    this.uploader = new FileUploader(options)

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo:Photo = JSON.parse(response);
        this.product.productPhotos?.push(photo);
     

        if (photo.isMain) {
          this.product.photoUrl = photo.url;
          this.product.photoUrl = photo.url;
        }
      }
    }
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.productsService.setMainPhoto(this.product.id,photo.id).subscribe(() => {
      this.product.photoUrl = photo.url;

      this.product.photoUrl = photo.url;
      this.product.productPhotos.forEach(p => p.isMain = p.id === photo.id);
    })
  }

  deletePhoto(photoId: number) {
    this.productsService.deletePhoto(this.product.id,photoId).subscribe(() => {
      this.product.productPhotos = this.product.productPhotos.filter(p => p.id !== photoId);
    });
  }

  cancel() {
    this.productsService.deleteProduct(this.product.id).subscribe(() => {});
    this.router.navigate(['/home']);
  }
}