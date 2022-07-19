import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'pinokem';
  users: any;

 

  constructor(private http: HttpClient, private accountService: AccountService){

  }

  ngOnInit(): void {
  
  this.setCurrentAdmin();
  this.setCurrentUser();
   
   
  }

  setCurrentUser() {
    const userFromLS:any = localStorage.getItem('user');
    const user = JSON.parse(userFromLS);
    this.accountService.setCurrentUser(user);
  }

  setCurrentAdmin(){
    const adminFormLS:any = localStorage.getItem('admin');
    const admin = JSON.parse(adminFormLS)
    this.accountService.setCurrentAdmin(admin);
   
  }
}
