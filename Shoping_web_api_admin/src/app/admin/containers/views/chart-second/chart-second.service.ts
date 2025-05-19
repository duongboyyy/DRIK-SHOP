import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChartSecondService {
  constructor(private http: HttpClient) { }
  getKhachHangMuaNhieuNhat():Observable<any>{
    return this.http.get<any>(environment.URL_API+"ThongKeSoLuongs/getkhachhangmuanhieunhat") 
  }
  getNamDoanhSo():Observable<any>{
    return this.http.get<any>(environment.URL_API+"ThongKeSoLuongs/nam2021")
  }
  getNam2021SoLuong():Observable<any>{
    return this.http.get<any>(environment.URL_API+"ThongKeSoLuongs/Soluongsanphambanratrongnam")
  }
  getSoLuongTon():Observable<any>{
    return this.http.get<any>(environment.URL_API+"ThongKeSoLuongs/soluongton")
  }
  getTopSoLuongTon():Observable<any>{
    return this.http.get<any>(environment.URL_API+"ThongKeBieuDos/topsoluongton")
  }
  ////////////////////////////////////
  getTopBienTheDoanhThu():Observable<any>{
    return this.http.get<any>(environment.URL_API+"ThongKeBieuDos/topbienthedoanhthu")
  }
  
  getThongKeThang(year: number): Observable<any> {
    return this.http.get<any>(`${environment.URL_API}ThongKeBieuDos/topthongkethang?year=${year}`);
  }
  
  getSoLanSanPhamXuatHienTrongDonHang(fromDate: Date, toDate: Date): Observable<any> {

    const from = fromDate.toISOString().split('T')[0]; 
    const to = toDate.toISOString().split('T')[0];
  
    return this.http.get<any>(`${environment.URL_API}ThongKeBieuDos/topsolanxuathientrongdonhang?fromDate=${from}&toDate=${to}`);
  }
  getSanPhamDoanhThuTop(fromDate: Date, toDate: Date): Observable<any> {
    const from = fromDate.toISOString().split('T')[0]; 
    const to = toDate.toISOString().split('T')[0];
    return this.http.get<any>(`${environment.URL_API}ThongKeBieuDos/topsanphamloinhattop?fromDate=${from}&toDate=${to}`);
  }
  getTopNhanHieuDoanhThu():Observable<any>{
    return this.http.get<any>(environment.URL_API+"ThongKeBieuDos/topnhanhieubanchaynhattrongnam")
  }
  dataThongKeNgay: any
  public dataSourceNgay: any = {
    chart: {
      caption: 'Doanh thu',
      xAxisName: 'Ngày',
      yAxisName: 'Số tiền thu về',
      numberSuffix: '',
      theme: 'umber'
    },
    data: Array.from({ length: 32 }, () => ({ label: "", value: "" }))
  }
}
