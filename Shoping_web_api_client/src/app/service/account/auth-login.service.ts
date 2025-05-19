import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AuthLoginService {
  private _authNavStatusSource = new BehaviorSubject<boolean>(this.isLoggedIn());
  authNavStatus$ = this._authNavStatusSource.asObservable();
  user: any = null;

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  updateAuthStatus(isLoggedIn: boolean) {
    this._authNavStatusSource.next(isLoggedIn);
  }

  saveLoginData(token: string, userId: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('idUser', userId);
    this.updateAuthStatus(true);
  }

  loadUserData() {
    const iduser = localStorage.getItem('idUser');
    if (!iduser) {
      console.error('iduser not found in localStorage');
      return;
    }
    return this.http.get(`${environment.URL_API}Auth/AuthHistory/${iduser}`);
  }

  logout() {
    return this.http.post(`${environment.URL_API}Auth/logout`, {}).toPromise()
      .then(() => {
        this.updateAuthStatus(false);

      })
      .catch((error) => {
        console.error('Logout failed', error);
        Swal.fire('Lỗi', 'Đăng xuất thất bại.', 'error');
      });
  }
}
