import { __values } from 'tslib';
import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router'; 
import * as signalR from '@microsoft/signalr';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { Banner1Service } from './banner1.service';
import { ToastServiceService } from '../../shared/toast-service.service';
import { BannerEditComponent } from './banner-edit/banner-edit.component';
import { environment } from '../../../../../environments/environment';
import { AuthGuard } from '../auth.guard';
@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent  extends SecondPageIndexBase implements OnInit {
  constructor(
    protected _injector: Injector,
    public service:Banner1Service,
    public router: Router,
    public http: HttpClient,
    public serviceToast: ToastServiceService) 
    {
      super(_injector);
    }
    

    dataSource: any = [];
    claim:any=[];
    searchModel: any = {
      key: '',
    };
    pageSize = 10;
    pageIndex = 0;
   @ViewChild(BannerEditComponent) _BannerEditComponent: BannerEditComponent;
   async ngOnInit() {
    this.cols = [
      { field: 'image', header: 'Ảnh ', visible: true, width: '10%', sort: false },
      { field: 'name', header: 'Name', visible: true, width: '20%', sort: true },
      { field: 'description', header: 'Description', visible: true, width: '20%', sort: true },
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

async getData() {
 await this.service.Gets(this.searchModel.key, -1, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
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
// getData(): void {
//   this.service.Gets().subscribe(
//     (data) => {
//       this.dataSource = data;
//       this.isLoading = false;
//     },
//     (error) => {
//       console.error('Error fetching banners:', error);
//       this.isLoading = false;
//     }
//   );
// }

onSearchProducts() {
this.pageIndex = 0;
this.getData();
}

clickDelete(id: number) {
  if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
    this.service.delete(id).then(
      res => {
        if (res.status) {
          const data = this.dataSource.filter(product => product.id !== id);
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
onEdit(id: any) {
  this._BannerEditComponent.showPopup(id);
}

onCloseForm(item: any) {
  var idx = this.dataSource.findIndex(x => x.id === item.id);
  this.service.Gets(this.searchModel.key, item.id, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
    if (res.status) {
      if(idx != -1) {
        this.dataSource[idx] = res.data[0];
      }
      else {
        this.dataSource.push({...res.data[0]});
      }
    }
  })
}

onSort(event) {
  this.sortField = event.field;
  this.getData();
}

}