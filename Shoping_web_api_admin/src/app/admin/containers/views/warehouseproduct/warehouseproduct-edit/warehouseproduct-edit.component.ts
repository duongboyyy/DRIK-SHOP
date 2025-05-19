import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { WarehouseproductService } from '../warehouseproduct.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { SanPhamBienThe1Service } from '../../san-pham-bien-thes/san-pham-bien-the1.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-warehouseproduct-edit',
  templateUrl: './warehouseproduct-edit.component.html',
  styleUrls: ['./warehouseproduct-edit.component.scss']
})
export class WarehouseproductEditComponent extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  isDropdownOpen = false;
  search_name:string;
  spbt_search=[];
  spbt_listSelect=[];
  warehouse_options = [];
  modelEdit: any = {};
  urls :string;
  startDate: Date;
  endDate:Date;
  fileListImg: any;
  arrCovertFrom: any[] = [];
  deletedImages: string[] = [];
  SoLuongNhap: { [key: number]: number } = {};
  private searchSubject = new Subject<string>();
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    public serviceToast: ToastServiceService,
    private _warehouseService: WarehouseService,
    private _spbtservice: SanPhamBienThe1Service,
    private _warehouseProductService: WarehouseproductService,
  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      NameSearch:new FormControl(''),
      KhoId: new FormControl('',Validators.compose([Validators.required])),
    });
    await this.getWarehouse();
    this.searchSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.getSPBT(value);
    });
  }

  async showPopup(id: any) {
    this.isShow = true;
    this.spbt_listSelect=[];
    if (id > 0) {
        await this._warehouseProductService.getDetail(id).then(re => {
            if (re.status) {
                this.modelEdit = re.data;
                this.modelEdit.id = id;
                const item = {
                  id: this.modelEdit.sanPhamBienTheId,
                  tenFull: this.modelEdit.tenFull
                };
                this.SoLuongNhap[re.data.sanPhamBienTheId]=re.data.soLuong;
                this.spbt_listSelect.push(item)
                console.log(this.modelEdit)
            }
        });
    } else {
        this.modelEdit = {};
        this.modelEdit.id = 0;
        this.urls = "";
    }
}

save() {
  this.submitted = true;
  //console.log(123)
  if (this.formGroup.valid) {
    console.log(123)
    this.spbt_listSelect.forEach(spbt => {
      const formData = new FormData();
      const item = {
          id: this.modelEdit.id,
          SanPhamBienTheId:spbt.id,
          KhoId: this.modelEdit.khoId,
          SoLuong:this.SoLuongNhap[spbt.id]
      };
      console.log("fix",item)

      for (const key in item) {
        formData.append(key, item[key]);
    }
      this._warehouseProductService.Save(formData).subscribe(re => {
          if (re.status) {
            if(this.modelEdit.id > 0) {
              this.serviceToast.showToastSuaThanhCong();
            }
            else {
              this.serviceToast.showToastThemThanhCong();
            }
            this.onSaved.emit(re.data);
            this.isShow = false;
          }
          else {
            this.serviceToast.showToastCofigError(re.message);
            this.isShow = true;
          }
      });
    });
     
  }
}
async getWarehouse(){
  this.warehouse_options=[];
  await this._warehouseService.getAllWarehouses('', 0, 1000, '').then(res => {
    if (res.status) {
      this.warehouse_options = res.data;
    }
  }).catch(error => {
    this._notifierService.showHttpUnknowError();
  });
}
onNameChange(value: string) {
  this.searchSubject.next(value);
}
onBlur() {
  // Delay 100ms để bắt được sự kiện click trước khi đóng dropdown
  setTimeout(() => this.isDropdownOpen = false, 100);
}
async getSPBT(keyword: string) {
  await this._spbtservice.Gets(keyword, 0, 1000, '').then(res => {
     if (res.status) {
       this.spbt_search = res.data;
       
     }
   }).catch(error => {
    
     this._notifierService.showHttpUnknowError();
   });
 }
 selectItem(item: any) {
  const exists = this.spbt_listSelect.some(sp => sp.id === item.id); // So sánh theo id sản phẩm

  if (!exists) {
    this.spbt_listSelect.push(item);
    if (!this.SoLuongNhap[item.id]) {
      this.SoLuongNhap[item.id] = 1;
    }
  }
  else this.serviceToast.showToastDaThem();

  this.search_name='';
  this.spbt_search = [];
  this.isDropdownOpen = false;
}
public deleteDetail(item: any) {
  for (var index = 0; index < this.spbt_listSelect.length; index++) {
    let detail = this.spbt_listSelect[index];
    if ( detail.TenSanPhamBienThe == item.TenSanPhamBienThe
      && detail.SoLuongNhap == item.SoLuongNhap) {
      this.spbt_listSelect.splice(index, 1);
    }
  }
}
formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2); // Tháng từ 0-11
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`; // Định dạng YYYY-MM-DD
}
closeForm() {
  this.isShow = false;
}


}
