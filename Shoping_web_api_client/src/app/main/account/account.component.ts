import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserIdenity} from '../../model/user.model'
import { CartService } from 'src/app/service/product.service';
import { environment } from 'src/environments/environment';
import { AuthLoginService } from 'src/app/service/account/auth-login.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  user:any;

  constructor(public http:HttpClient,private cartService: CartService, private authService: AuthLoginService) { }

  ngOnInit(): void {
    this.authService.authNavStatus$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.authService.loadUserData().subscribe(
          res => this.user = res,
          error => console.error('Failed to fetch user data:', error)
        );
      }
    });
  }
  logout() {
    this.authService.logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('idUser');
    localStorage.removeItem('products');
    window.location.href = '/login';
  }
}
