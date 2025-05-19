import { Product1Service } from './product1.service';
import { Component, Injector, OnInit } from '@angular/core'
import { Product, ProductService } from './product.service'
import { AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastServiceService } from '../../shared/toast-service.service';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends SecondPageIndexBase implements OnInit, AfterViewInit {
  @ViewChild(ProductEditComponent) _ProductEditComponent: ProductEditComponent;

  constructor(
    protected _injector: Injector,
    public service: ProductService,
    private pService: Product1Service,
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

    cols = [];
    stateOptions = [
      { label: 'Ẩn', value: 'fasle' },
      { label: 'Hiện', value: 'true' },
    ];
 
    async ngOnInit() {

      this.cols = [
        // { field: 'id', header: 'Mã', visible: true, width: '10%', sort: true },
        { field: 'ten', header: 'Tên sản phẩm', visible: true, width: '20%', sort: true },
        { field: 'image', header: 'Ảnh', visible: true, width: '10%', sort: false },
        { field: 'soLuongLike', header: 'Số lượt thích', visible: true, width: '10%', sort: true },
        { field: 'soLuongComment', header: 'Số comment', visible: true, width: '10%', sort: true },
        { field: 'giaBan', header: 'Giá bán', visible: true, width: '10%', sort: true },
        { field: 'giaNhap', header: 'Giá nhập', visible: true, width: '10%', sort: true },
        { field: 'khuyenMai', header: 'Giá khuyến mại', visible: true, width: '10%', sort: true },
        { field: 'trangThaiSanPham', header: 'Trạng thái sản phẩm', visible: true, width: '10%', sort: true },
        { field: 'trangThaiHoatDong', header: 'Trạng thái hoạt động', visible: true, width: '10%', sort: true }
      ];

    await this.getData();
    // const clicks = localStorage.getItem('idUser');
    // console.log("clicks",clicks);
    // this.http.get<any>(`${environment.URL_API+"UserRoleClaim/GetsUserRoleClaim"}/${clicks}`).subscribe
    // ((res:any)=>{
    //   this.claim=res.data;
    //   console.log("claim",this.claim[0].value);
    // });
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

  ngAfterViewInit(): void { 
  } 

  updateActiveStatus(id: number) { 
    this.pService.UpdateState(id).then(re => {
      if(re.status) {
      }
    })
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
     await this.pService.getAllProducts1(this.searchModel.key, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
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
  

  exportGeneratePdf() {
    window.open("https://localhost:44302/api/GeneratePdf/allsanpham", "_blank");
  }

  clickDelete(id: number) {
    if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
      this.pService.delete(id).then(
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
    this._ProductEditComponent.showPopup(id);
  }

  onCloseForm(item: any) {
    var idx = this.dataSource.findIndex(x => x.id === item.id);
    this.pService.GetProductById(item.id).then(re => {
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