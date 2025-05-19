import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { UserService } from 'src/app/service/account/user.service';
import { environment } from 'src/environments/environment';
import { VnpayService } from 'src/app/service/payment/vnpay.service';
@Component({
  selector: 'app-contact',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  list_hoadon:any;
  paymentModelInfomation = {

  }
  constructor(public http:HttpClient,private userService: UserService,  private vnPayService: VnpayService) {
    // userService.checkLogin();
   }
  ngOnInit(): void {
    this.userService.checkLogin();
    const clicks = localStorage.getItem('idUser');
    this.http.post(environment.URL_API+"hoadons/danhsachhoadon/",{
      idUser:clicks
    }).subscribe(
      res=>{
        this.list_hoadon=res;
      });
    const connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl('https://localhost:44302/notify')
    .build();
  connection.start().then(function () {
    console.log('SignalR Connected!');
  }).catch(function (err) {
    return console.error(err.toString());
  });
  connection.on("BroadcastMessage", () => {
    this.http.post(environment.URL_API+"hoadons/danhsachhoadon/",{
      idUser:clicks
    }).subscribe(
      res=>{
        this.list_hoadon=res;
      });
  }
  )
}

async createPayment(invoiceModel: any) {

  this.paymentModelInfomation = {
    amount: invoiceModel.tongTien,
    tongTien: invoiceModel.tongTien,
    orderType: 'other',
    orderDescription: 'đã thanh toán đơn hàng',
    name: "bạn",
    ghiChu: invoiceModel.ghiChu,
    trangThai: invoiceModel.trangThai,
    loaiThanhToan: invoiceModel.loaiThanhToan,
    isPayed: invoiceModel.isPayed,
    tinh:invoiceModel.tinh,
    huyen: invoiceModel.huyen,
    xa: invoiceModel.xa,
    diaChi: invoiceModel.diaChi,
    id_User: invoiceModel.id_User,
    idHoaDon: invoiceModel.id,
    //listProductOrder: this.list_item.filter(item => item.selected).map(item => item.cartID)
  };

  console.log(this.paymentModelInfomation);

  await this.vnPayService.Save(this.paymentModelInfomation).then(re => {
    window.location.href = re.data;
  }).catch(err => {
    console.error("Error creating payment:", err);
  });
}

}
