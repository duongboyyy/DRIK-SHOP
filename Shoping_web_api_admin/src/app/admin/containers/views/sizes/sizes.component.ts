import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Injector, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastServiceService } from '../../shared/toast-service.service';
import {  Size, SizeService } from './size.service';
import * as signalR from '@microsoft/signalr';
import { SizeComponent } from './size/size.component';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { Size1Service } from './size1.service';
import { SizeEditComponent } from './size-edit/size-edit.component';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent extends SecondPageIndexBase implements OnInit {
  @ViewChild(SizeEditComponent) _SizeEditComponent: SizeEditComponent;

  dataSource: any = [];
  searchModel: any = {
    key: '',
  };
  pageSize = 10;
  pageIndex = 0;
  constructor(
    protected _injector: Injector,
    private service: Size1Service,
    private router : Router,
    private http: HttpClient,
    private toastService: ToastServiceService) 
    {
      super(_injector);
    }            
    async ngOnInit() { 
      this.cols = [
        // { field: 'id', header: 'Mã', visible: true, width: '10%', sort: true },
         // { field: 'id_Loai', header: 'Mã danh mục', visible: true, width: '10%', sort: true },
         { field: 'tenSize', header: 'Size',  align: 'center', visible: true, width: '50%', sort: true },
        { field: 'tenLoai', header: 'Danh mục',  align: 'center',visible: true, width: '50%', sort: true },
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
        this._SizeEditComponent.showPopup(id);
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
