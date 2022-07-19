import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Admin } from '../models/admin';
import { adminRepository } from '../models/adminRepository';
import { Customer } from '../models/customer';
import { AccountService } from './account.service';

 

@Injectable({
  providedIn: 'root'
})
export class AdminsService {

  baseUrl = environment.apiUrl;
  adminrepo!: adminRepository;
  admin!: Admin;

  getAdmin(username: string): Observable<adminRepository>{
    return this.http.get<adminRepository>(`${this.baseUrl}admins/${username}`)
  }

  constructor(private http: HttpClient,
    private accountService: AccountService
    ) {
    accountService.currentUser$
      .pipe(take(1))
      .subscribe((admin: any) => {
        this.admin = admin;
      });
   }
   

  updateAdmin(username: string, admin: adminRepository) {
    return this.http.put(`${this.baseUrl}admins/${username}`,admin).pipe(
    tap(_ => {
      this.adminrepo = admin;
    })
  )
    
  }


  deletePhoto(username: string, photoId: number) {
    return this.http.delete(`${this.baseUrl}admins/${username}/delete-photo/${photoId}`);
  }


 
}
