import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { ToastServiceService } from '../../shared/toast-service.service';
import { WarehouseEditComponent } from './warehouse-edit/warehouse-edit.component';
import { WarehouseService } from './warehouse.service';


@Component({
  selector: 'warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent  extends SecondPageIndexBase implements OnInit, AfterViewInit {
  @ViewChild(WarehouseEditComponent) _WarehouseEditComponent: WarehouseEditComponent;

  constructor(
    protected _injector: Injector,
    private _warehouseService: WarehouseService,
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
        { field: 'name', header: 'Tên kho', visible: true, width: '20%', sort: true },
        { field: 'diaChi', header: 'Địa chỉ', visible: true, width: '10%', sort: false },
        { field: 'tinh', header: 'Tỉnh', visible: true, width: '10%', sort: true },
        { field: 'huyen', header: 'Huyện', visible: true, width: '10%', sort: true },
        { field: 'xa', header: 'Xã', visible: true, width: '10%', sort: true },
        { field: 'isActive', header: 'Trạng thái', visible: true, width: '10%', sort: true },
       
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
     await this._warehouseService.getAllWarehouses(this.searchModel.key, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
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
    console.log(id)
    if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
      this._warehouseService.delete(id).then(
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
    this._WarehouseEditComponent.showPopup(id);
    console.log(id);
  }

  onCloseForm(item: any) {
    var idx = this.dataSource.findIndex(x => x.id === item.id);
    this._warehouseService.GetWareHouseById(item.id).then(re => {
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