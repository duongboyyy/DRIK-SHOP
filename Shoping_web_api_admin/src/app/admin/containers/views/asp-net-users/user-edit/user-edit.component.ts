import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core'; 
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User1Service } from '../user1.service';
import { first } from 'rxjs/operators';
@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
  })
export class UserEditComponent  extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  isEdit: boolean = false;
  modelEdit: any = {};
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        protected _injector: Injector,
        private messageService: MessageService,
        private serviceToast: ToastServiceService,
        private serviceD: User1Service
      ) {
        super(null,_injector);
      }
      async ngOnInit() {
        this.formGroup = new FormGroup({
          userName: new FormControl('', Validators.compose([Validators.required])),
          fristName: new FormControl('', Validators.compose([Validators.required])),
          lastName:  new FormControl('', Validators.compose([Validators.required])),
          phone:new FormControl('', Validators.compose([Validators.required])),
          roles:new FormControl('', Validators.compose([Validators.required])),
          email:new FormControl('', Validators.compose([Validators.required])),
          password:new FormControl('', Validators.compose([Validators.required])),
          confirmPassword:new FormControl('', Validators.compose([Validators.required])),
        });
      }


      closeForm() {
        this.isShow = false;
      }

      async showPopupModal(type: any, id:any) {
        console.log(type, id);
        this.isShow = true; 
        this.modelEdit = {};
        this.modelEdit.id = 0; 
        this.isEdit = type === 1 ? false : true;
        if(this.isEdit){
          await this.serviceD.GetByUserId(id).then(res => {
            if (res.status) {
              this.modelEdit = res.data;
            }
          })
        }
    }

    save() {
      this.submitted = true;
      if (this.modelEdit.password !== this.modelEdit.confirmPassword) {
        this.serviceToast.showToastTao();
        return;
      }
      if (this.formGroup.valid) {
          const formData = new FormData();
          const item = {
              id: this.modelEdit.id,
              userName:this.modelEdit.userName,
              firstName:this.modelEdit.firstName,
              lastName:this.modelEdit.lastName,
              phone:this.modelEdit.phone,
              roles:this.modelEdit.roles,
              email:this.modelEdit.email,
              password:this.modelEdit.password,
              confirmPassword:this.modelEdit.confirmPassword,
          };
          for (const key in item) {
            formData.append(key, item[key]);
            //console.log(item[key]);
        }
        this.serviceD.Save(formData).subscribe(re => {
          if (re.status) {
            
            this.serviceToast.showToastThemThanhCong();
            this.onSaved.emit(re.data);
            this.isShow = false;
          }
          else {
            this.serviceToast.showToastThemThatBai();
            this.isShow = true;
          }
      });

    }
    
  }
}