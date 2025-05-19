import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core'; 
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { BrandService } from '../../brands/brand.service';
import { NhaCungCapService } from '../../nhacungcaps/nhacungcap.service';
import { NhaCungCap1Service } from '../../nhacungcaps/nhacungcap1.service';
import { Brand1Service } from '../../brands/brand1.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.scss']
})
export class SupplierEditComponent  extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  modelEdit: any = {}; 
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private serviceSup: NhaCungCap1Service
  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      ten: new FormControl('', Validators.compose([Validators.required])),
      sdt: new FormControl(''),
      thongTin: new FormControl(''),
      diaChi: new FormControl(''),
    });
   
  }
 
  async showPopup(id: any) {
    this.isShow = true; 
    if (id > 0) {
        this.serviceSup.getDetail(id).then(re => {
            if (re.status) {
                this.modelEdit = re.data;
                this.modelEdit.id = id;
            }
        });
    } else {
        this.modelEdit = {};
        this.modelEdit.id = 0; 
    }
}

save() {
  this.submitted = true;
  if (this.formGroup.valid) {
      const formData = new FormData();
      const item = {
          id: this.modelEdit.id,
          ten: this.modelEdit.ten,
          sdt: this.modelEdit.sdt,
          thongTin: this.modelEdit.thongTin,
          diaChi: this.modelEdit.diaChi
      };

      for (const key in item) {
          formData.append(key, item[key]);
      }
 
      this.serviceSup.Save(formData).subscribe(re => {
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

closeForm() {
  this.isShow = false;
}

}
