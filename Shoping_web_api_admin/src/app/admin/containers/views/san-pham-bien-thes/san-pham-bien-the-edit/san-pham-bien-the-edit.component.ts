import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core'; 
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category1Service } from '../../categories/category1.service';
import { SanPhamBienThe1Service } from '../san-pham-bien-the1.service';
import { ColorService } from '../../mau-sacs/color.service';
import { Size1Service } from '../../sizes/size1.service';
import { Product1Service } from '../../products/product1.service';
import { Subject, Subscription } from 'rxjs';

interface Product {
  id: number;
  ten: string;
  image: string;
}

interface DropdownOption {
  label: string;
  value: number;
  image: string;
}

@Component({
  selector: 'app-san-pham-bien-the-edit',
  templateUrl: './san-pham-bien-the-edit.component.html',
  styleUrls: ['./san-pham-bien-the-edit.component.scss']
})

export class SanPhamBienTheEditComponent  extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  modelEdit: any = {}; 
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  size_category_name: any[] = [];
  color_category_name: any[] = [];
  product_autoComplete: any = [];
  searchModel: any = {
    key: '',
  }
  isLoading: boolean = false;
  private searchTimeout: any;
  isAdd: boolean = false;

  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private serviceD: SanPhamBienThe1Service,
    private _clrService: ColorService,
    private _sizeService: Size1Service,
    public serviceCategory: Category1Service,
    public serviceProduct: Product1Service,
  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      id_Mau: new FormControl('', Validators.compose([Validators.required])),
      id_SanPham: new FormControl('', Validators.compose([Validators.required])),
      sizeId: new FormControl('', Validators.compose([Validators.required])),
      soLuongTon: new FormControl(0, Validators.compose([Validators.required])),
    });
   await this.loadColorCate();
   await this.loadSizeCate();
   await this.LoadProductAutoComplete();
  }
 
 
  async loadColorCate() {
    this.color_category_name = [{ label: '-- Kiểu Loại Màu --' }];
    await this._clrService.GetColorFollowCategory().then(rs => {
        if (rs.status) {
            rs.data.forEach(item => {
                this.color_category_name.push({ label: item.loaiTenMau, value: item.id });
            });
        }
    });
  }

  async loadSizeCate() {
    this.size_category_name = [{ label: '-- Kiểu Loại Size --' }];
    await this._sizeService.GetSizeFollowCategory().then(rs => {
        if (rs.status) {
            rs.data.forEach(item => {
                this.size_category_name.push({ label: item.sizeLoaiTen, value: item.id });
            });
        }
    });
  }

  async LoadProductAutoComplete() {
    this.isLoading = true;
    try {
      const response = await this.serviceProduct.GetAutoCompleteProduct(this.searchModel.key, 0, 100);
      if (response.status) {
        this.product_autoComplete = response.data.map(item => ({
          label: item.ten,
          value: item.id,
          image: item.image,
          id_Loai: item.id_Loai
        }));
      } else {
        this.product_autoComplete = [];
      }
    } catch (error) {
      console.error(error);
      this.product_autoComplete = [];
    } finally {
      this.isLoading = false;
    }
  }
  
  GetIdCategory(event: any) {
    console.log(event);
  }

  onProductFilter(event: any) { 
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  
    this.searchTimeout = setTimeout(() => {
      this.searchModel.key = event.filter || "";
      this.LoadProductAutoComplete();
    }, 700);
  }

  async showPopup(id: any) {
    this.isShow = true; 
    console.log('id',id)
    if (id > 0) {
        this.serviceD.getDetail(id).then(re => {
            if (re.status) {
                this.modelEdit = re.data[0];
                this.modelEdit.id = id;
                this.isAdd=false;
                this.modelEdit.sizeId=this.modelEdit.id_Size;
                console.log('mo',this.modelEdit)
            }
        });
    } else {
        this.modelEdit = {};
        this.modelEdit.id = 0; 
        this.modelEdit.soLuongTon=0;
        this.isAdd = false;
    }
}

save() {
  this.submitted = true;
  console.log('abbc',this.formGroup.valid)
  if (this.formGroup.valid==true) {
    
      const formData = new FormData();
      const item = {
          id: this.modelEdit.id,
          sizeId: this.modelEdit.sizeId,
          sanPhamId: this.modelEdit.id_SanPham,
          mauId: this.modelEdit.id_Mau,
          soLuongTon:this.modelEdit.soLuongTon,
          // tenSize: this.modelEdit.tenSize,
      };
      console.log('a',item)

      for (const key in item) {
          formData.append(key, item[key]);
      }
 
      this.serviceD.Save(formData).subscribe(re => {
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
            //this.serviceToast.showToastSuaThatBai();
            this.isShow = true;
          }
      });
  }
}

closeForm() {
  this.isShow = false;
}

}
