import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate  {

  constructor(
    private accountService:AccountService,
    private toastr:ToastrService
  ) { }

  canActivate(): Observable<boolean> {
    return this.accountService.currentAdmin$.pipe(
      map(admin => {
        if (admin) return true;
        this.toastr.error('Admins only');
        return false;
      })
    )
  }

}
