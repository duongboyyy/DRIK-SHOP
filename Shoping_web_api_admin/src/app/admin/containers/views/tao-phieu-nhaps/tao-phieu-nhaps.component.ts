import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Data, Router } from '@angular/router';
import { ToastServiceService } from '../../shared/toast-service.service';
import * as signalR from '@microsoft/signalr';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { TaoPhieuNhap1Service } from './tao-phieu-nhap1.service';
import { DiscountService } from '../discout-codes/discount.service';
import { TaoPhieuNhapDetailComponent } from './tao-phieu-nhap-detail/tao-phieu-nhap-detail.component';
import { TaoPhieuNhapComponent } from './tao-phieu-nhap/tao-phieu-nhap.component';
import { environment } from '../../../../../environments/environment';
import { NhaCungCap1Service } from '../nhacungcaps/nhacungcap1.service';

@Component({
  selector: 'app-tao-phieu-nhaps',
  templateUrl: './tao-phieu-nhaps.component.html',
  styleUrls: ['./tao-phieu-nhaps.component.scss']
})
export class TaoPhieuNhapsComponent extends SecondPageIndexBase implements OnInit,AfterViewInit {
  @ViewChild(TaoPhieuNhapDetailComponent) _TaoPhieuNhapDetailComponent: TaoPhieuNhapDetailComponent;
  @ViewChild(TaoPhieuNhapComponent) _TaoPhieuNhapComponent: TaoPhieuNhapComponent;
  dataSource: any = [];
  searchModel: any = {
    key: '',
  };
  idUser:any;
  pageSize = 10;
  pageIndex = 0;
  state_options = [];
  payed_options = [];
  loai_dons = [];

  lst_ncc = [{ label: '-- Nhà cung cấp --', value : -1}];
  constructor(
    protected _injector: Injector,
    private service: TaoPhieuNhap1Service,
    private router: Router,
    private http: HttpClient,
    private _NccService: NhaCungCap1Service,
    private serviceToast: ToastServiceService) 
    {
      super(_injector);
    }

  displayedColumns: string[] = [ 'soChungTu', 'ngayTao', 'ghiChu', 'tongTien','tenNhaCungCap','nguoiLapPhieu','actions'];
  async ngOnInit() {
    await this.loadActiveOptions();
    await this.loadNcc();
    this.cols = [
      { field: 'soChungTu', header: 'Số Chứng Từ', visible: true, width: '20%', sort: false },
      { field: 'tenNhaCungCap', header: 'Tên Nhà Cung Cấp', visible: true, width: '20%', sort: true }, 
      { field: 'nguoiLapPhieu', header: 'Người Lập Phiếu', visible: true, width: '20%', sort: true }, 
      { field: 'ghiChu', header: 'Ghi Chú', visible: true, width: '20%', sort: true },
      { field: 'ngayTao', header: 'Ngày Tạo', visible: true, width: '20%', sort: true },
      { field: 'tongTien', header: 'Tổng Tiền', visible: true, width: '20%', sort: false },
      { field: 'congNo', header: 'Công nợ', visible: true, width: '20%', sort: false },
      { field: 'isPayment', header: 'Thanh toán', visible: true, width: '20%', sort: false },
    ];

  await this.getData();
  // const clicks = localStorage.getItem('idUser');
  //   console.log("clicks",clicks);
  //   this.http.get<any>(`${environment.URL_API+"UserRoleClaim/GetsUserRoleClaim"}/${clicks}`).subscribe
  //   ((res:any)=>{
  //     this.claim=res.data;
  //     console.log("claim",this.claim[0].value);
  //   });
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

  async loadNcc() {
    await this._NccService.GetShort().then(res => {
      if (res.status) {
        res.data.forEach((item: any) => {
          this.lst_ncc.push({
            label: item.ten,
            value: item.id
          });
        });
        console.log(this.lst_ncc);
      }
    });
  }

  async loadActiveOptions() {

    this.payed_options.push({ label: '-- Thanh Toán --', value : -1});
    this.payed_options.push({ label: 'Đã thanh toán', value: 1 });
    this.payed_options.push({ label: 'Chưa thanh toán', value: 0 });
 
  }

  async getData() {
   await this.service.Gets(this.searchModel.key, this.searchModel.idNcc, this.searchModel.isPayment, this.searchModel.startDate, this.searchModel.endDate, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
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
  
  onSearchProducts() {
  this.pageIndex = 0;
  this.getData();
  }

    
  onSort(event) {
    this.sortField = event.field;
    this.getData();
  }

  ngAfterViewInit() {
    console.log("TaoPhieuNhapDetailComponent đã khởi tạo");
  }
  modelEdit: any = {};
  onCloseForm(item: any) {
    console.log(item);
    this.dataSource.push(item);
    this.getData();
  }
  clickDelete(id: number) {
    if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
      this.service.delete(id).then(
        res => {
          if (res.status) {
            const data = this.dataSource.filter(p => p.id !== id);
            this.dataSource = data;
            this.serviceToast.showToastXoaThanhCong();
          } else {
            this.serviceToast.showToastXoaThatBai();
          }
        },
        err => {
          this.serviceToast.showToastXoaThatBai();
        }
      );
    }
  }
  onEdit(id:any){
    this._TaoPhieuNhapDetailComponent.showPopup(id);
  }
  exportGeneratePdf() {
    window.open("https://localhost:44302/api/GeneratePdf/allphieunhap", "_blank");
  }
  onAdd(){
    this._TaoPhieuNhapComponent.showPopup();
  }


  async onEditMutilple(selectedItems: any) {
    this.idUser=localStorage.getItem("idUser")
    var request = {
      userId: this.idUser,
      danhSachPhieu: selectedItems.map((item: any) => item.id)
    }
    if (confirm('Bạn có chắc chắn muốn cập nhật không?')) {
        const res = await this.service.updateMultiCongNo(request).then(re => {
            if (re.status) {
              this.getData();

              this.serviceToast.showToastCofigSuccess("Cập nhật thành công");
            } else {
              this.serviceToast.showToastCofigError("Lỗi");
            }
        });
    }
  }
}