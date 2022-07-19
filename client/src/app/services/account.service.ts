import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Admin } from '../models/admin';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  private currentUserSource$ = new ReplaySubject<User | null>(1);
  private currentAdminSource$ = new ReplaySubject<Admin | null>(1);


  currentUser$ = this.currentUserSource$.asObservable();
  currentAdmin$ = this.currentAdminSource$.asObservable();

  login(model: any){
    return this.http.post<User>(this.baseUrl + 'account/login', model)
    .pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      }))
  }

  Adminlogin(model: any){
    return this.http.post<Admin>(this.baseUrl + 'account/adminLogin', model)
    .pipe(
      map((response: Admin) => {
        const admin = response;
        if (admin) {
          this.setCurrentAdmin(admin);
        }
        return admin;
      }))
  }

  setCurrentUser(user: User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource$.next(user);
  }

  setCurrentAdmin(admin: Admin){
    localStorage.setItem('admin', JSON.stringify(admin));
    this.currentAdminSource$.next(admin);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource$.next(null);
  }

  adminLogout() {
    localStorage.removeItem('admin');
    this.currentAdminSource$.next(null);

  }

  register(model: any){
      return this.http.post<User>(this.baseUrl + 'account/register', model)
        .pipe(
          map((user : User) => {
            if(user){
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource$.next(user);
          }
          return user;
        })
      )
  }


    

}
