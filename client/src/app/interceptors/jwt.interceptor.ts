import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { take } from 'rxjs/operators';
import { Admin } from '../models/admin';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private account: AccountService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User = { token: '', userName: '', photoUrl:'', email:'', city: ''};
    let currentAdmin: Admin = { token: '', userName: '', photoUrl:'', email:''};


    this.account.currentUser$.pipe(take(1)).subscribe((user: User | null) => { if (user) currentUser = user });
    if (currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }

    
    this.account.currentAdmin$.pipe(take(1)).subscribe((admin: Admin | null) => { if (admin) currentAdmin = admin });
    if (currentAdmin.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentAdmin.token}`
        }
      })
    }
    return next.handle(request);
  }
}
