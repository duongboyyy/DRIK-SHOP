import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core'; 
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service'; 
import { Brand1Service } from '../brand1.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.scss']
})
export class BrandEditComponent  extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  modelEdit: any = {}; 
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private serviceBrand: Brand1Service
  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      ten: new FormControl('', Validators.compose([Validators.required])),
    });
   
  }
 
  async showPopup(id: any) {
    this.isShow = true; 
    if (id > 0) {
        this.serviceBrand.getDetail(id).then(re => {
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
      };

      for (const key in item) {
          formData.append(key, item[key]);
      }
 
      this.serviceBrand.Save(formData).subscribe(re => {
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
