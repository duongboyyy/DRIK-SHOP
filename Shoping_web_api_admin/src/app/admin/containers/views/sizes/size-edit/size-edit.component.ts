import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core'; 
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Size1Service } from '../size1.service';
import { Category1Service } from '../../categories/category1.service';
@Component({
  selector: 'app-size-edit',
  templateUrl: './size-edit.component.html',
  styleUrls: ['./size-edit.component.scss']
})
export class SizeEditComponent  extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  modelEdit: any = {}; 
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  category_options = [];
  
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private serviceD: Size1Service,
    public serviceCategory: Category1Service,

  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      tenSize: new FormControl('', Validators.compose([Validators.required])),
      id_Loai: new FormControl('', Validators.compose([Validators.required])),
    });
   await this.loadCate();
  }
 
  async loadCate() {
    this.category_options = [{ label: '-- Danh mục --' }];
    await this.serviceCategory.Gets('', 0, 1000, "").then(rs => {
        if (rs.status) {
            rs.data.forEach(item => {
                this.category_options.push({ label: item.ten, value: item.id });
            });
        }
    });
  }

  async showPopup(id: any) {
    this.isShow = true; 
    if (id > 0) {
        this.serviceD.getDetail(id).then(re => {
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
          tenSize: this.modelEdit.tenSize,
          id_Loai: this.modelEdit.id_Loai,
      };

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
