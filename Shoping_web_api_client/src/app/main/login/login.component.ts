import { SocialUser } from "angularx-social-login";
import { GoogleLoginProvider,SocialAuthService } from "angularx-social-login";
import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../service/account/user.service';
import Swal from 'sweetalert2';
import { AccountsService } from "src/app/service/account.service";
import { environment } from "src/environments/environment";
import { Product } from "src/app/model/product.model";

declare const google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable()
export class LoginComponent implements OnInit {
  user: SocialUser;
  private subscription: Subscription;
  brandNew: boolean;
  errors: string;
  isRequesting: boolean;
  submitted: boolean = false;
  credentials: Credentials = { email: '', password: '' };
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
    // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();
  loggedIn:boolean = false;
  constructor(
    public authService: SocialAuthService,
    public router : Router,
    private activatedRoute: ActivatedRoute ,
    public http : HttpClient,
    public userService : UserService,
    private _AccountsService: AccountsService,
  ){}
 
  isLoggedIn() {
    return this.loggedIn;
  }
  public newForm: FormGroup;
  ngOnInit() {
    this.newForm = new FormGroup({
      userName : new FormControl(null),
      passWord : new FormControl(null),
    });
  
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        this.brandNew = param['brandNew'];
        this.credentials.email = param['email'];
      });
  
    this.authService.authState.subscribe(user => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  
    // Kiểm tra xem Google API đã được tải chưa
    // if (typeof google !== 'undefined' && google.accounts) {
    //   google.accounts.id.initialize({
    //     client_id: environment.GG_CLIENT_ID, // Thay bằng Client ID của bạn
    //     callback: (response: any) => this.handleCredentialResponse(response),
    //   });
  
    //   google.accounts.id.renderButton(
    //     document.getElementById("signInDiv"), 
    //     { theme: "outline", size: "large" }
    //   );
    // } else {
    //   console.error('Google API is not loaded');
    // }
  }
  
  // handleCredentialResponse(response: any) {
  //   const tokenId = response.credential;

  //   this._AccountsService.loginWithGoogle(tokenId)
  //     .then((data: any) => {
  //       localStorage.setItem('auth_token', data.token);
  //       localStorage.setItem('idUser', data.user.id);

  //       Swal.fire("Đăng nhập thành công.", '', 'success');
  //       this.router.navigate(['/']);
  //       const userId = data.user.id;
  //       this._authNavStatusSource.next(true);
  //       this.http.post(`${environment.URL_API}Carts/getCart/${userId}`, {})
  //         .subscribe(
  //           (cart: any) => {
  //             localStorage.setItem('products', JSON.stringify(cart));
  //           },
  //           (error) => {
  //             console.error('Failed to load cart:', error);
  //           }
  //         );
  //     })
  //     .catch(error => {
  //       console.error('Login failed:', error);
  //       Swal.fire('Lỗi', 'Đăng nhập bằng Google thất bại.', 'error');
  //     });
  // }
  
  // signInWithGoogle() {
  //   if (typeof google !== 'undefined' && google.accounts) {
  //     google.accounts.id.prompt(); // Hiển thị pop-up đăng nhập Google
  //   } else {
  //     Swal.fire('Lỗi', 'Google API chưa được tải. Vui lòng thử lại sau.', 'error');
  //   }
  // }

  async signInWithGoogle() {
    try {
      const userData = await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  
      const response: any = await this._AccountsService.loginWithGoogle(userData.idToken);
  
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('idUser', response.user.id);
      Swal.fire("Đăng nhập thành công.", '', 'success');
      // this.router.navigate(['/']);
      window.location.href = "/";
      this.loggedIn = true;
      const userId = response.user.id;
      this._authNavStatusSource.next(true);
  
      this.http.post(`${environment.URL_API}Carts/getCart/${userId}`, {})
        .subscribe(
          (cart: any) => localStorage.setItem('products', JSON.stringify(cart)),
          (error) => console.error('Failed to load cart:', error)
        );
      
    } catch (error) {
      console.error('Login error:', error);
      const message = error === 'popup_closed_by_user' 
        ? 'Bạn đã đóng cửa sổ đăng nhập Google. Vui lòng thử lại.' 
        : 'Đăng nhập bằng Google thất bại.';
      Swal.fire('Lỗi', message, 'error');
    }
  }
  

  signOut() {
    this.authService.signOut();
  }
  onLogOut(){
    localStorage.removeItem('auth_token');
    this.loggedIn = false
  }
  onLogin(){
    this.router.navigate(['/register']);
  }
onSubmit = (data) =>{
  let form = new FormData();
  form.append('UserName', data.userName);
  form.append('Password',data.passWord);
    this.submitted = true;
    this.isRequesting = true;
    this.errors='';
    this.userService.login(data.userName,data.passWord)
    //await this.userService.login(userName, password);
    }
}
export interface Credentials {
  email: string;
  password: string;
}
