import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChartThirdService {
  constructor(private http:HttpClient) { }
  getSoLuongTonService():Observable<any>{
    return this.http.get<any>(environment.URL_API+"ThongKeBieuDos/toptonkho")
  }
  getNhaCungCapTongTienService(fromDate: Date, toDate: Date): Observable<any> {

    const from = fromDate.toISOString().split('T')[0]; 
    const to = toDate.toISOString().split('T')[0];
  
    return this.http.get<any>(`${environment.URL_API}ThongKeBieuDos/nhacungcaptongtien?fromDate=${from}&toDate=${to}`);
  }
  getNhaCungCapSoLuongService(fromDate: Date, toDate: Date): Observable<any> {
    const from = fromDate.toISOString().split('T')[0]; 
    const to = toDate.toISOString().split('T')[0];
    return this.http.get<any>(`${environment.URL_API}ThongKeBieuDos/nhacungcapsoluong?fromDate=${from}&toDate=${to}`);
  }
}
