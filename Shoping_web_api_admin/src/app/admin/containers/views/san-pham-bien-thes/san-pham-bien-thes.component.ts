import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastServiceService } from '../../shared/toast-service.service';
import { SanPhamBienTheComponent } from './san-pham-bien-the/san-pham-bien-thecomponent';
import * as signalR from '@microsoft/signalr';
import { SanPhamBienThe, SanPhamBienTheService, GiaSanPhamMauSacSanPhamSize } from './san-pham-bien-the.service';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { SanPhamBienThe1Service } from './san-pham-bien-the1.service';
import { SanPhamBienTheEditComponent } from './san-pham-bien-the-edit/san-pham-bien-the-edit.component';
import { environment } from '../../../../../environments/environment';
import { WarehouseProductService } from '../../../../services/warehouseProduct.service';
@Component({
  selector: 'app-san-pham-bien-thes',
  templateUrl: './san-pham-bien-thes.component.html',
  styleUrls: ['./san-pham-bien-thes.component.scss']
})
export class SanPhamBienThesComponent  extends SecondPageIndexBase implements OnInit {
  @ViewChild(SanPhamBienTheEditComponent) _SanPhamBienTheEditComponent: SanPhamBienTheEditComponent;

  dataSource: any = [];
  searchModel: any = {
    key: '',
  };
  pageSize = 10;
  pageIndex = 0;

  constructor(
    protected _injector: Injector,
    private service: SanPhamBienThe1Service,
    private router : Router,
    private http: HttpClient,
    private warehouseProductService: WarehouseProductService,
    private toastService: ToastServiceService) 
    {
      super(_injector);
    }

    
  public sanphambienthe :  GiaSanPhamMauSacSanPhamSize
  async ngOnInit() {
    this.cols = [
      // { field: 'id', header: 'Mã', visible: true, width: '10%', sort: true },
       // { field: 'id_Loai', header: 'Mã danh mục', visible: true, width: '10%', sort: true },
      { field: 'tenSanPham', header: 'Sản Phẩm',  align: 'center', visible: true, width: '20%', sort: true },
      { field: 'maMau', header: 'Màu',  align: 'center',visible: true, width: '20%', sort: true },
      { field: 'tenSize', header: 'Size',  align: 'center',visible: true, width: '20%', sort: true },
      { field: 'soLuongTon', header: 'Số Lượng Tồn',  align: 'center',visible: true, width: '20%', sort: true },
    ];
  //   this.service.getAllGiaSanPhamMauSacSanPhamSizes();
  //   const connection = new signalR.HubConnectionBuilder()
  //   .configureLogging(signalR.LogLevel.Information)
  //   .withUrl('https://localhost:44302/notify')
  //   .build();
  // connection.start().then(function () {
  //   console.log('SignalR Connected!');
  // }).catch(function (err) {
  //   return console.error(err.toString());
  // });
  // connection.on("BroadcastMessage", () => {
  //   this.service.getAllGiaSanPhamMauSacSanPhamSizes();
  // });
  await this.getData();
  // const clicks = localStorage.getItem('idUser');
  //   console.log("clicks",clicks);
  //   this.http.get<any>(`${environment.URL_API+"UserRoleClaim/GetsUserRoleClaim"}/${clicks}`).subscribe
  //   ((res:any)=>{
  //     this.claim=res.data;
  //     console.log("claim",this.claim[0].value);
  //   });
  }
  async getData() {
    await this.service.Gets(this.searchModel.key, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
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
   clickDelete(id: number) {
    if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
      this.service.delete(id).then(
        res => {
          if (res.status) {
            const data = this.dataSource.filter(c => c.id !== id);
            this.dataSource = data;
            this.toastService.showToastXoaThanhCong();
          } else {
            this.toastService.showToastXoaThatBai();
          }
        },
        err => {
          this.toastService.showToastXoaThatBai();
        }
      );
    }
  }
  
   onEdit(id: any) {
    this._SanPhamBienTheEditComponent.showPopup(id);
  }
  
  
  onCloseForm(item: any) {
    var idx = this.dataSource.findIndex(x => x.id === item.id);
    this.service.getDetail(item.id).then(re => {
      if(re.status) {{
        console.log("d",re.data)
        if(idx != -1) {
          this.dataSource[idx] = re.data[0];
        }
        else {
          this.dataSource.push({...re.data[0]});
        }
      }}
      console.log('data',this.dataSource)
    })
  }

  onSynchronousQuantityProduct(id: any) {
    var idx = this.dataSource.findIndex(x => x.id === id);
    this.warehouseProductService.syncProduct(id).then(res => {
        if (!res.status) {
            this.toastService.showToastCofigError(res.message);
            return;
        }

        if (res.data == null) {
            this.toastService.showToastCofigWarming("Sản phẩm không tồn tại trong kho");
            return;
        }

        if (idx !== -1) {
            this.dataSource[idx].soLuongTon = res.data.tongSoLuong;
        }

        this.toastService.showToastCofigSuccess(res.message);
    });
  }


}
