import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill_details.component.html',
  styleUrls: ['./bill_details.component.scss']
})
export class BillDetailsComponent implements OnInit {
  id_bill: any;
  bill: any;
  bill_details: any[] = [];
  tongtien: number = 0;
  lyDoHoanHang: string = '';
  isShowModal: boolean = false;
  constructor(public http: HttpClient, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_bill = params['id'];
      this.loadChiTietPhieu();
    });
  }

  /** Gọi API lấy thông tin chi tiết hóa đơn */
  loadChiTietPhieu() {
    // Lấy thông tin hóa đơn
    this.http.get(`${environment.URL_API}hoadons/hoadon/${this.id_bill}`).subscribe(
      (res: any) => {
        if (res.status) {
          this.bill = res.data;
          console.log('Hóa đơn:', this.bill);
        }
      },
      err => console.error('Lỗi lấy hóa đơn:', err)
    );

    // Lấy danh sách chi tiết hóa đơn
    this.http.post(`${environment.URL_API}chitiethoadons/chitiethoadon/${this.id_bill}`, {}).subscribe(
      (res: any) => {
        if (res.status) {
          this.bill_details = res.data;
          console.log('Chi tiết hóa đơn:', this.bill_details);
          
          // Tính tổng tiền
          this.tongtien = this.bill_details.reduce((sum, item) => sum + (item.sanPham?.khuyenMai * item.soluong), 0);
          //this.tongtien += 25000; // Cộng phí giao hàng
        }
      },
      err => console.error('Lỗi lấy chi tiết hóa đơn:', err)
    );
  }

  /** Hủy đơn hàng */
  Huy() {
    this.http.post(`${environment.URL_API}chitiethoadons/huydon/${this.id_bill}`, {}).subscribe(
      res => {
        console.log('Đã hủy đơn hàng:', res);
        this.loadChiTietPhieu(); // Load lại dữ liệu sau khi hủy
      },
      err => console.error('Lỗi khi hủy đơn:', err)
    );
  }

  Return(bill: any) {
    if(bill.trangThai === 2){
      this.http.post(`${environment.URL_API}chitiethoadons/hoandon/${this.id_bill}`, {}).subscribe(
        res => {
          console.log('Đã hủy đơn hàng:', res);
          this.loadChiTietPhieu();
        },
        err => console.error('Lỗi khi hủy đơn:', err)
      );
    }
  }


  HoanDon(bill: any) {
    if (bill.trangThai === 2) {
      const body = {
        id: this.id_bill,
        note: this.lyDoHoanHang
      };
  
      this.http.post(`${environment.URL_API}chitiethoadons/hoandonNote`, body).subscribe(
        res => {
          console.log('Yêu cầu hoàn hàng đã gửi:', res);
          this.loadChiTietPhieu();
          this.closeModal(); // Đóng modal sau khi gọi API thành công
        },
        err => console.error('Lỗi khi gửi yêu cầu hoàn hàng:', err)
      );
    }
  }
  
  openModal() {
    this.isShowModal = true;
  }
  
  closeModal() {
    this.isShowModal = false;
    this.lyDoHoanHang = '';
  }
}
