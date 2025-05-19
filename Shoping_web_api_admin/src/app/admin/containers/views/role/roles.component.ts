
import { RoleService } from "./role.service";
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { disconnect } from 'process';
import { ToastServiceService } from '../../shared/toast-service.service';
import { CategoryService, Category } from '../categories/category.service';
import { CategoryComponent } from '../categories/category/category.component';
import * as signalR from '@microsoft/signalr';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { RoleEditComponent } from "./role-edit/role-edit.component";
import { environment } from "../../../../../environments/environment";
@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent extends SecondPageIndexBase implements OnInit {
    constructor(
        protected _injector: Injector,
        public pService: RoleService,
        public router: Router,
        public http: HttpClient,
        public serviceToast: ToastServiceService) 
        {
          super(_injector);
        }
        dataSource: any = [];
        searchModel: any = {
        key: '',
        };
        pageSize = 10;
        pageIndex = 0;
        @ViewChild(RoleEditComponent) _RoleEditComponent: RoleEditComponent;
        async ngOnInit() {

            this.cols = [
              // { field: 'id', header: 'Mã', visible: true, width: '10%', sort: true },
              { field: 'name', header: 'Name', visible: true, width: '40%', sort: true },
              //{ field: 'concurrencyStamp', header: 'ConcurrencyStamp', visible: true, width: '20%', sort: true },
            ];
            await this.getData();
            //         const clicks = localStorage.getItem('idUser');
            // console.log("clicks",clicks);
            // this.http.get<any>(`${environment.URL_API+"UserRoleClaim/GetsUserRoleClaim"}/${clicks}`).subscribe
            // ((res:any)=>{
            //   this.claim=res.data;
            //   console.log("claim",this.claim[0].value);
            // });
        }
        ngAfterViewInit(): void { 
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
          console.log('Fetching data...');
          await this.pService.getAllRoles(this.searchModel.key, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
            console.log('Fetching data...');
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
        clickDelete(id: string) {
          if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
            this.pService.deletestring(id).then(
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
          // async onCloseForm(item: any) {
          //   if (!item || !item.id) return;
          //   var idx = this.dataSource.findIndex(x => x.id === item.id);
          //   this.pService.getDetail(item.id).then(res => {
          //     if (res.status) {
          //       const updatedItem = res.data[0];
          //       if(idx != -1) {
          //         this.dataSource[idx] = updatedItem;
          //       }
          //       else {
          //         this.dataSource = [...this.dataSource, updatedItem];
          //       }
          //       this.dataSource = [...this.dataSource];
          //     }
              
          //   }).catch(error => {
          //     console.error('Lỗi khi lấy dữ liệu chi tiết:', error);
          //     this.serviceToast.showToastSuaThatBai();
          //   });
          // }
          onCloseForm(item: any) {
            if (item && item.id) {
              const idx = this.dataSource.findIndex(x => x.id === item.id);
              if (idx !== -1) {
                // Cập nhật dữ liệu trong dataSource nếu đã có
                this.dataSource[idx] = item; // Giả sử item đã được cập nhật đầy đủ thông tin
              } else {
                // Thêm mới nếu không tìm thấy
                this.dataSource.push(item);
              }
            } else {
              // Nếu item không có id, bạn có thể muốn làm gì đó khác, ví dụ:
              console.warn('Item không hợp lệ:', item);
            }
          }
          
          
            onEdit(id: any) {
              this._RoleEditComponent.showPopup(id);
            }
          onSort(event) {
            this.sortField = event.field;
            this.getData();
          }
}