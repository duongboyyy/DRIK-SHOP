import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core'; 
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DiscountService } from '../discount.service';
@Component({
  selector: 'app-discout-edit',
  templateUrl: './discout-edit.component.html',
  styleUrls: ['./discout-edit.component.scss']
})
export class DiscoutEditComponent  extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  modelEdit: any = {}; 
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private serviceD: DiscountService
  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      soTienGiam: new FormControl('', Validators.compose([Validators.required])),
      soLuong: new FormControl('', Validators.compose([Validators.required])),
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
          soTienGiam: this.modelEdit.soTienGiam,
          soLuong:this.modelEdit.soLuong,
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
