import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { WarehouseproductEditComponent } from './warehouseproduct-edit/warehouseproduct-edit.component';
import { ToastServiceService } from '../../shared/toast-service.service';
import { WarehouseproductService } from './warehouseproduct.service';

@Component({
  selector: 'warehouseproduct',
  templateUrl: './warehouseproduct.component.html',
  styleUrls: ['./warehouseproduct.component.scss']
})
export class WarehouseproductComponent  extends SecondPageIndexBase implements OnInit, AfterViewInit {
  @ViewChild(WarehouseproductEditComponent) _WarehouseproductEditComponent: WarehouseproductEditComponent;

  constructor(
    protected _injector: Injector,
    private _warehouseproductService: WarehouseproductService,
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
        { field: 'image', header: 'Ảnh', visible: true, width: '10%', sort: true },
        { field: 'tenSanPhamBienThe', header: 'Tên sản phẩm', visible: true, width: '20%', sort: true },
        { field: 'mau', header: 'Màu', visible: true, width: '10%', sort: false },
        { field: 'size', header: 'Size', visible: true, width: '10%', sort: false },
        { field: 'tenKho', header: 'Tên kho', visible: true, width: '10%', sort: false },
        { field: 'soLuong', header: 'Số lượng', visible: true, width: '10%', sort: true },
        
       
      ];

    await this.getData();
  }
  ngAfterViewInit(): void { 
  } 
 

  // updateActiveStatus(id: number) { 
  //   this.pService.UpdateState(id).then(re => {
  //     if(re.status) {
  //     }
  //   })
  //   }

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
     await this._warehouseproductService.getAllWarehousesProduct(this.searchModel.key, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
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
      this._warehouseproductService.delete(id).then(
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
    this._WarehouseproductEditComponent.showPopup(id);
    console.log(id);
  }

  onCloseForm(item: any) {
    var idx = this.dataSource.findIndex(x => x.id === item.id);
    this._warehouseproductService.GetWareHouseById(item.id).then(re => {
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