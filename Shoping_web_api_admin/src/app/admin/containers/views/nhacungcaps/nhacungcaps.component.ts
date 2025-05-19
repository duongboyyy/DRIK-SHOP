import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Injector, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastServiceService } from '../../shared/toast-service.service';
import * as signalR from '@microsoft/signalr';
import { NhaCungCapComponent } from './nhacungcap/nhacungcap.component';
import { NhaCungCap, NhaCungCapService } from './nhacungcap.service';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { NhaCungCap1Service } from './nhacungcap1.service';
import { SupplierEditComponent } from './supplier-edit/supplier-edit.component';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-nhacungcaps',
  templateUrl: './nhacungcaps.component.html',
  styleUrls: ['./nhacungcaps.component.scss']
})
export class NhaCungCapsComponent  extends SecondPageIndexBase implements OnInit, AfterViewInit {
  dataSource: any = [];
  searchModel: any = {
    key: '',
  };
  pageSize = 10;
  pageIndex = 0; 

  @ViewChild(SupplierEditComponent) _SupplierEditComponent: SupplierEditComponent;

    constructor(
      protected _injector: Injector,
      private service:NhaCungCap1Service,
      private router : Router,
      private http: HttpClient,
      private dialog: MatDialog,
      private toastService: ToastServiceService) 
      {
        super(_injector);
      }
 async ngOnInit() {
    // this.service.getAllNhaCungCaps();
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
    //   this.service.getAllNhaCungCaps();
    // });
    this.cols = [
      // { field: 'id', header: 'Mã', visible: true, width: '10%', sort: true },
      { field: 'ten', header: 'Tên', visible: true, width: '20%', sort: true },
      { field: 'sdt', header: 'Điện thoại', visible: true, width: '20%', sort: true },
      { field: 'thongTin', header: 'Thông tin', visible: true, width: '30%', sort: true },
      { field: 'diaChi', header: 'Địa chỉ', visible: true, width: '30%', sort: true },
    ];

    await this.getData();
    // const clicks = localStorage.getItem('idUser');
    // console.log("clicks",clicks);
    // this.http.get<any>(`${environment.URL_API+"UserRoleClaim/GetsUserRoleClaim"}/${clicks}`).subscribe
    // ((res:any)=>{
    //   this.claim=res.data;
    //   console.log("claim",this.claim[0].value);
    // });
  }
  ngAfterViewInit(): void { 
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
    this._SupplierEditComponent.showPopup(id);
  }
  
  
  onCloseForm(item: any) {
    var idx = this.dataSource.findIndex(x => x.id === item.id);
    this.service.getDetail(item.id).then(re => {
      if(re.status) {{
        if(idx != -1) {
          this.dataSource[idx] = re.data;
        }
        else {
          this.dataSource.push({...re.data});
        }
      }}
    })
  }
}
