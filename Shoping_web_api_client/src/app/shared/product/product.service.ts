import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(public http: HttpClient) {
  }
  getlaytatcasanpham(): Observable<any> {
    return this.http.get<any>(environment.URL_API + "sanphams/GetCompleteProduct")
  }
  getsanphammoi(): Observable<any> {
    return this.http.get<any>(environment.URL_API + "sanphams/topsanphammoi")
  }
  searchTheoLoai(idLoai: number): Observable<any> {
    const params = new HttpParams().set('i', idLoai.toString());
    return this.http.get((environment.URL_API)+"sanphams/searchtheoloai", { params });
  }
  public trangthaiDataProduct: boolean
}
