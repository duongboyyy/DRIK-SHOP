import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router'; 
import { Blog, BlogService } from './blog.service';
import { BlogComponent } from './blog/blog.component';
import * as signalR from '@microsoft/signalr';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { Blog1Service } from './blog1.service';
import { ToastServiceService } from '../../shared/toast-service.service';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent  extends SecondPageIndexBase implements OnInit {
  constructor(
    protected _injector: Injector,
    public service:Blog1Service,
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
    @ViewChild(BlogEditComponent) _BlogEditComponent: BlogEditComponent;
   async ngOnInit() {

    this.cols = [
      // { field: 'id', header: 'Mã', visible: true, width: '10%', sort: true },
      { field: 'image', header: 'Ảnh đại diện', visible: true, width: '10%', sort: false },
      { field: 'tieuDe', header: 'Tiêu Đề', visible: true, width: '20%', sort: true },
      // { field: 'noiDung', header: 'Nội dung', visible: true, width: '10%', sort: false },
    ];

  await this.getData();
  // const clicks = localStorage.getItem('idUser');
  //   console.log("clicks",clicks);
  //   this.http.get<any>(`${environment.URL_API+"UserRoleClaim/GetsUserRoleClaim"}/${clicks}`).subscribe
  //   ((res:any)=>{
  //     this.claim=res.data;
  //     console.log("claim",this.claim[0].value);
  //   });
  // this.service.getAllProducts('',0,20);
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
  //   this.service.getAllProducts('',0,20);
  // });
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
  this._BlogEditComponent.showPopup(id);
}

onCloseForm(item: any) {
  var idx = this.dataSource.findIndex(x => x.id === item.id);
  this.service.GetBlogEdit(item.id).then(re => {
    if(re.status) {{
      if(idx != -1) {
        this.dataSource[idx] = re.data[0];
      }
      else {
        this.dataSource.push({...re.data[0]});
      }
    }}
  })
}

onSort(event) {
  this.sortField = event.field;
  this.getData();
}

}