import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Data, Router } from '@angular/router';
import { ToastServiceService } from '../../shared/toast-service.service';
import { HoaDonComponent } from './hoa-don/hoa-don.component';
import {  HoaDonUser, HoaDonService } from './hoadon.service';
import * as signalR from '@microsoft/signalr';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { HoaDon1Service } from './hoadon1.service';
import { HoaDonEditComponent } from './hoa-don-edit/hoa-don-edit.component';
import { HoaDonEditMultipleComponent } from './hoa-don-edit-multiple/hoa-don-edit-multiple.component';
import { HoaDonAddComponent } from './hoa-don-add/hoa-don-add.component';
@Component({
  selector: 'app-hoa-dons',
  templateUrl: './hoa-dons.component.html',
  styleUrls: ['./hoa-dons.component.scss']
})
export class HoaDonsComponent extends SecondPageIndexBase implements OnInit {
  selectedItems: any[] = [];
  dataSource: any = [];
  searchModel: any = {
    key: '',
  };
  pageSize = 10;
  pageIndex = 0;
  id_cuahang:any;

  state_options = [];
  payed_options = [];
  loai_dons = [];
  constructor(
    protected _injector: Injector,
    public service: HoaDon1Service,
    public router: Router,
    public http: HttpClient,
    public serviceToast: ToastServiceService) 
    {
      super(_injector);
    }

  displayedColumns: string[] = ['id', 'id_User', 'ngayTao', 'ghiChi', 'tongTien','trangThai','actions'];
  async ngOnInit() {

    await this.loadActiveOptions();
    const storedId = localStorage.getItem('id_cuahang');
    console.log(storedId)
    this.id_cuahang = storedId !== null ? Number(storedId) : 0;

    this.cols = [
      // { field: 'id', header: 'Mã', visible: true, width: '10%', sort: true },
      { field: 'fullName', header: 'Người Đặt', visible: true, width: '10%', sort: false },
      { field: 'trangThai', header: 'Trạng Thái', visible: true, width: '20%', sort: true }, 
      { field: 'ghiChu', header: 'Ghi Chú', visible: true, width: '20%', sort: true },
      { field: 'ngayTao', header: 'Ngày Tạo', visible: true, width: '20%', sort: true },
      { field: 'tongTien', header: 'Tổng Tiền', visible: true, width: '20%', sort: false },
      { field: 'thanhToan', header: 'Hình thức thanh toán', visible: true, width: '20%', sort: false },
      { field: 'isPayed', header: 'Thanh toán', visible: true, width: '20%', sort: false },
    ];

  await this.getData();
    // const connection = new signalR.HubConnectionBuilder()
    //   .configureLogging(signalR.LogLevel.Information)
    //   .withUrl('https://localhost:44302/notify')
    //   .build();
    // connection.start().then(function () {
    //   console.log('SignalR Connected!');
    // }).catch(function (err) {
    //   return console.error(err.toString());
    // });
    // connection.on("BroadcastMessage", () => {
    //   this.service.getAllHoaDons();
    // });

  }
  
  async loadActiveOptions() {

    this.state_options = [{ label: '-- Trạng thái --', value: -1 }];
    this.state_options.push({ label: 'Chờ xác nhận', value: 0 });
    this.state_options.push({ label: 'Đã xác nhận', value: 1 });
    this.state_options.push({ label: 'Hoàn thành', value: 2 });
    this.state_options.push({ label: 'Huỷ', value: 3 });
    this.state_options.push({ label: 'Đang giao hàng', value: 4 });
    this.state_options.push({ label: 'Chờ thanh toán', value: 5 });
    this.state_options.push({ label: 'Yêu cầu hoàn hàng', value: 6 });
    this.state_options.push({ label: 'Đang xử lý đơn hoàn', value: 7 });
    this.state_options.push({ label: 'Hoàn hàng tất cả', value: 8 });
    this.state_options.push({ label: 'Hoàn hàng huỷ', value: 9 });
    this.state_options.push({ label: 'Hoàn hàng một phần', value: 10 });
    this.state_options.push({ label: 'Hoàn hàng thành công', value: 11 });

    this.payed_options.push({ label: '-- Thanh Toán --', value : -1});
    this.payed_options.push({ label: 'Đã thanh toán', value: 1 });
    this.payed_options.push({ label: 'Chưa thanh toán', value: 0 });

    this.loai_dons = [{ label: '-- Loại đơn --', value: -1 }];
    this.loai_dons.push({ label: 'Đơn Offline', value: 1 });
    this.loai_dons.push({ label: 'Đơn Online', value: 2 });
  }


  onPageChange(event) {
    this.getData();
  } 
  
  onChangeRowLimit() {
    this.getData();
    this.fixTableScrollProblem();
  }
  
  toggleSearch() {
    super.toggleSearch();
    this.fixTableScrollProblem();
  }
  
  async getData() {
   await this.service.Gets(this.searchModel.key, -1 , this.searchModel.isPayed, this.searchModel.loaiDon, this.searchModel.trangThai, this.searchModel.startDate, this.searchModel.endDate, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
      if (res.status) {
        this.dataSource = res.data;
        this.total = res.totalRecord;
        this.isLoading = false;
      }
    }).catch(error => {
      this.isLoading = false;
      this._notifierService.showHttpUnknowError();
    });
  }

  logSelected() {
    console.log('Bản ghi đã chọn:', this.selectedItems);
  }
  onSearchProducts() {
  this.pageIndex = 0;
  this.getData();
  }
  

  exportGeneratePdf() {
    window.open("https://localhost:44302/api/GeneratePdf/allorder", "_blank");
  }

  // clickDelete(id: number) {
  //   if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
  //     this.service.delete(id).then(
  //       res => {
  //         if (res.status) {
  //           const data = this.dataSource.filter(product => product.id !== id);
  //           this.dataSource = data;
  //           this.serviceToast.showToastXoaThanhCong();
  //         } else {
  //           this.serviceToast.showToastXoaThatBai();
  //         }
  //       },
  //       err => {
  //         this.serviceToast.showToastXoaThatBai();
  //       }
  //     );
  //   }
  // }
    
  onSort(event) {
    this.sortField = event.field;
    this.getData();
  }
  @ViewChild(HoaDonEditComponent) _HoaDonEditComponent: HoaDonEditComponent;
  @ViewChild(HoaDonEditMultipleComponent) _HoaDonEditMultipleComponent: HoaDonEditMultipleComponent;
  @ViewChild(HoaDonAddComponent) _HoaDonAddComponent: HoaDonAddComponent;
  onEdit(id:any){
    this._HoaDonEditComponent.showPopup(id);
  }
  onEditMutilple(selectedItems){
    console.log(selectedItems)
    this._HoaDonEditMultipleComponent.showPopup(selectedItems);
  }
  onAdd(id:any){
    this._HoaDonAddComponent.showPopup(id);
  }
  modelEdit: any = {};
  onCloseForm(item: any) {
    var idx = this.dataSource.findIndex(x => x.id === item.id);
    this.service.getDetailhoadon(item.id).then(re => {
        if(idx != -1) {
          this.modelEdit=re;
          console.log(':',this.modelEdit.hoaDon.trangThai);
          this.dataSource[idx].trangThai = this.modelEdit.hoaDon.trangThai;
        }
    })
  }
  onCloseFormMultiple(item: any) {
    
  }

  // isCheckboxDisabled(item: any): boolean {
  //   const trangThai = Number(item.trangThai); // Chuyển thành số để xử lý chuỗi
  //   console.log(`Item ID: ${item.id}, TrangThai: ${item.trangThai}, Disabled: ${[3, 8, 9].includes(trangThai)}`);
  //   return [3, 8, 9].includes(trangThai) || isNaN(trangThai); // Disable nếu là 3, 8, 9 hoặc không hợp lệ
  // }

}
