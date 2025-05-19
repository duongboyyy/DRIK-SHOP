import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { CtkmsEditComponent } from './ctkms-edit/ctkms-edit.component';
import { ProductService } from '../products/product.service';
import { Product1Service } from '../products/product1.service';
import { Router } from '@angular/router';
import { HttpClient } from '@microsoft/signalr';
import { ToastServiceService } from '../../shared/toast-service.service';
import { ProductEditComponent } from '../products/product-edit/product-edit.component';
import { CtkmsService } from './ctkms.service';
import { CtkmsConfigComponent } from './ctkms-config/ctkms-config.component';

@Component({
  selector: 'app-ctkms',
  templateUrl: './ctkms.component.html',
  styleUrls: ['./ctkms.component.scss']
})
export class CtkmsComponent  extends SecondPageIndexBase implements OnInit, AfterViewInit {
  @ViewChild(CtkmsEditComponent) _CtkmsEditComponent: CtkmsEditComponent;
  @ViewChild(CtkmsConfigComponent) _CtkmsConfigComponent: CtkmsConfigComponent;

  constructor(
    protected _injector: Injector,
    public service: ProductService,
    private pService: Product1Service,
    private _ctkmsService: CtkmsService,
    //public router: Router,
    //public http: HttpClient,
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
        { field: 'name', header: 'Tên chương trình', visible: true, width: '20%', sort: true },
        { field: 'image', header: 'Ảnh', visible: true, width: '10%', sort: false },
        { field: 'discountValue', header: 'Giá trị giảm', visible: true, width: '10%', sort: true },
        { field: 'discountType', header: 'Loại giảm', visible: true, width: '10%', sort: true },
        //{ field: 'startDate', header: 'Ngày bắt đầu', visible: true, width: '10%', sort: true },
        //{ field: 'endDate', header: 'Ngày kết thúc', visible: true, width: '10%', sort: true },
        { field: 'isActive', header: 'Trạng thái', visible: true, width: '10%', sort: false },
       
      ];

    await this.getData();
  }
  ngAfterViewInit(): void { 
  } 
 

  updateActiveStatus(id: number) { 
    this._ctkmsService.UpdateState(id).then(re => {
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
     await this._ctkmsService.getAllCTKMs(this.searchModel.key, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
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
      this._ctkmsService.delete(id).then(
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
    this._CtkmsEditComponent.showPopup(id);
  }
  onConfig(id: any) {
    this._CtkmsConfigComponent.showPopup(id);
  }

  onCloseForm(item: any) {
    var idx = this.dataSource.findIndex(x => x.id === item.id);
    this._ctkmsService.GetCTKMById(item.id).then(re => {
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
