import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { Category1Service } from '../../categories/category1.service';
import { BrandService } from '../../brands/brand.service';
import { NhaCungCapService } from '../../nhacungcaps/nhacungcap.service';
import { NhaCungCap1Service } from '../../nhacungcaps/nhacungcap1.service';
import { Product1Service } from '../../products/product1.service';
import { Brand1Service } from '../../brands/brand1.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CtkmsService } from '../ctkms.service';
import * as moment from 'moment';
import { data, event } from 'jquery';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-ctkms-config',
  templateUrl: './ctkms-config.component.html',
  styleUrls: ['./ctkms-config.component.scss']
})
export class CtkmsConfigComponent extends SecondPageEditBase implements OnInit {
  [x: string]: any;
  formGroup: FormGroup;
  isDropdownOpen = false;
  submitted = false;
  spbt_search=[];
  spbt_listSelect=[];
  key:string="";
  brand_options = [];
  category_options=[];
  config_options = [
    {label: '-- Áp dụng chương trình khuyến mãi --'},
    {label : 'Theo danh mục', value: 1},
    {label : 'Theo sản phẩm', value: 2},
  ];
  modelEdit: any = {};
  page=1;
  limit=20;
  sortField="";
  idCTKM: any;
  dataSPByIdCTKM:any=[];
  dataSP:any=[];
  search_name:string='';
  private searchSubject = new Subject<string>();
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    public serviceToast: ToastServiceService,
    public serviceCategory: Category1Service,
    private _product1Service: Product1Service,
    private _ctkmsService: CtkmsService
  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      selector: new FormControl(''),
      deletedImages: new FormControl(''),
      NameSearch:new FormControl(''),
    });
    await this.getCategory();
    //await this.getData();
    this.searchSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.getSPBT(value);
    });
  }
  async showPopup(id: any) {
    this.isShow = true;
    this.idCTKM=id;
    await this.getData();
}
async getCategory(){
  await this.serviceCategory.Gets('', 0, 1000, '').then(res => {
    if (res.status) {
      this.category_options = res.data;
    }
  }).catch(error => {
    
    this._notifierService.showHttpUnknowError();
  });
}
async getData(event?: any) {
  this.isLoading = true;
  console.log(1222)
  
  if (event) {
    this.page = event.first / event.rows + 1;
    this.limit = event.rows;
    this.sortField = event.sortField || '';
  }

    await this._ctkmsService.getSPByIdCTKM(
      this.idCTKM,
      this.key,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
    ).then(res=> {
      if(res.status){
        this.dataSPByIdCTKM = res.data;
        this.total = res.totalRecord;
      }
    }).catch(error => {
    
      this._notifierService.showHttpUnknowError();
    });
}
save() {
  this.submitted = true;
  if (this.formGroup.valid) {
      const formData = new FormData();
      const item = {
          id: this.modelEdit.id,
          Name: this.modelEdit.name,
          Description: this.modelEdit.description || null,
          StartDate: this.modelEdit.startDate ? this.formatDate(this.modelEdit.startDate) : null,
          EndDate: this.modelEdit.endDate ? this.formatDate(this.modelEdit.endDate) : null,
          DiscountType: this.modelEdit.discountType || '',
          DiscountValue: this.modelEdit.discountValue || 0,
          Image:this.modelEdit.image || null
          // deletedImages: this.deletedImages.join(',')
      };
      console.log("fix",item)

      for (const key in item) {
        formData.append(key, item[key]);
    }
    

      this._ctkmsService.Save(formData).subscribe(re => {
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
            this.serviceToast.showToastSuaThatBai();
            this.isShow = true;
          }
      });
  }
}
selectItem(item: any) {
  const exists = this.dataSP.some(sp => sp.id === item.id); // So sánh theo id sản phẩm

  if (!exists) {
    this.dataSP.push(item);
  }
  else this.serviceToast.showToastDaThem();

  this.search_name='';
  this.spbt_search = [];
  this.isDropdownOpen = false;
}
onNameChange(value: string) {
  this.searchSubject.next(value);
}
onBlur() {
  // Delay 100ms để bắt được sự kiện click trước khi đóng dropdown
  setTimeout(() => this.isDropdownOpen = false, 100);
}
async getSPBT(keyword: string) {
  await this._ctkmsService.GetAutoCompleteProduct(this.idCTKM,keyword, 0, 1000).then(res => {
     if (res.status) {
       this.spbt_search = res.data;
       
     }
   }).catch(error => {
    
     this._notifierService.showHttpUnknowError();
   });
 }
async xoa(row){
  console.log(row)
  await this._ctkmsService.xoaSanPhamCTKM(this.idCTKM,row.id).subscribe(
    re=>{
      if(re.status){
        const data = this.dataSPByIdCTKM.filter(product => product.id !== row.id);
        this.dataSPByIdCTKM= data;
        console.log(re)
      }
    }
  )
}
async xoa2(row){
  const data = this.dataSP.filter(product => product.id !== row.id);
        this.dataSP= data;
}
async onCategoryChange(event: any) {
  await this._ctkmsService.GetProductsAvailableForCTKM(
    event.value,
   this.idCTKM
  ).then(res=> {
    if(res.status){
      this.dataSP=res.data
      console.log(res.data)
    }
  }).catch(error => {
  
    this._notifierService.showHttpUnknowError();
  });
}
async apdung(){
  const tasks = this.dataSP.map(item => 
    this._ctkmsService.ThemSanPhamCTKM(this.idCTKM, item.id).toPromise()
  );
  await Promise.all(tasks);
  this.getData();
  
  this.dataSP=[]
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
  this.formGroup.get('selector')?.setValue(null); 
  this.dataSP=[];
}

}