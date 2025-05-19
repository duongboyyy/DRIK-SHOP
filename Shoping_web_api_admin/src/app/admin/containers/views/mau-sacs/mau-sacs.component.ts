import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Injector, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastServiceService } from '../../shared/toast-service.service';
import { MauSac, MauSacService } from './mau-sac.service';
import { MauSacComponent } from './mau-sac/mau-sac.component';
import * as signalR from '@microsoft/signalr';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { ColorService } from './color.service';
import { ColorEditComponent } from './color-edit/color-edit.component';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-mau-sacs',
  templateUrl: './mau-sacs.component.html',
  styleUrls: ['./mau-sacs.component.scss']
})
export class MauSacsComponent  extends SecondPageIndexBase implements OnInit {
  @ViewChild(ColorEditComponent) _ColorEditComponent: ColorEditComponent;

  dataSource: any = [];
  searchModel: any = {
    key: '',
  };
  pageSize = 10;
  pageIndex = 0;
  constructor(
    protected _injector: Injector,
    private service: ColorService,
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
         { field: 'maMau', header: 'Mã Màu',  align: 'center', visible: true, width: '50%', sort: true },
        { field: 'tenLoai', header: 'Danh mục',  align: 'center',visible: true, width: '50%', sort: true },
      ];
      await this.getData();
    //   const clicks = localStorage.getItem('idUser');
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
        this._ColorEditComponent.showPopup(id);
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
