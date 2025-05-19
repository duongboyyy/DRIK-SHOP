import { Banner } from './../banner.service';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core'; 
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Banner1Service } from '../banner1.service';
@Component({
  selector: 'app-banner-edit',
  templateUrl: './banner-edit.component.html',
  styleUrls: ['./banner-edit.component.scss']
})
export class BannerEditComponent  extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  
  modelEdit: any = {};
  urls :string;
  viewImg_dd = new Array<string>();
  selectedFiles: FileList;
  fileListImg: any;
  arrCovertFrom: any[] = [];
  banner_type = [
    {label: '-- Type--'},
    {label : 'Top', value: 1},
    {label : 'Middle', value: 2},
    {label : 'Bottom', value: 3},
  ];
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        protected _injector: Injector,
        private messageService: MessageService,
        private serviceToast: ToastServiceService,
        private serviceD: Banner1Service
      ) {
        super(null,_injector);
      }
      async ngOnInit() {
        this.formGroup = new FormGroup({
          name: new FormControl('', Validators.compose([Validators.required])),
          description: new FormControl(this.modelEdit?.description || ''),
          bannerType: new FormControl('', Validators.compose([Validators.required])),
          link: new FormControl(this.modelEdit?.link || ''),
          startDate: new FormControl(this.modelEdit?.startDate||'' ),
          endDate: new FormControl(this.modelEdit?.endDate||''),
        });
      }


      closeForm() {
        this.isShow = false;
      }
      async showPopup(id: any) {
        this.isShow = true; 
        if (id >0) {
            this.serviceD.getDetail(id).then(re => {
                if (re.status) {
                    this.modelEdit = re.data;
                    this.modelEdit.id = id;
                    this.urls=this.getImageBanner(re.data.image);
                    this.modelEdit.startDate = new Date(this.modelEdit.startDate);
                    this.modelEdit.endDate = new Date(this.modelEdit.endDate);
                }
            });
        } else {
            this.modelEdit = {};
            this.modelEdit.id = 0; 
            this.urls="";
        }
    }
    save() {

      console.log(1);
      

      this.submitted = true;
      if (this.formGroup.valid) {
          const formData = new FormData();
          const item = {
              id: this.modelEdit.id,
              name: this.modelEdit.name,
              description: this.modelEdit.description||'',
              bannerType: this.modelEdit.bannerType,
              link:this.modelEdit.link||'',
              startDate: this.modelEdit.startDate ? this.formatDate(this.modelEdit.startDate) : null,
              endDate: this.modelEdit.endDate ? this.formatDate(this.modelEdit.endDate) : null,
          };
    
          for (const key in item) {
              formData.append(key, item[key]);
          }
          if (this.arrCovertFrom != null) {
            
            formData.append('files', this.arrCovertFrom[this.arrCovertFrom.length-1]);
            
        }
        console.log(formData);
        
     
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
    
    formatDate(date: Date): string {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2); // Tháng từ 0-11
      const day = ('0' + d.getDate()).slice(-2);
      return `${year}-${month}-${day}`; // Định dạng YYYY-MM-DD
    }
     
  onFileSelected(event: any): void {
    this.detectFiles(event, 1);
    this.onSelectFile(event);
  }

  detectFiles(event, type) {
    if(type === 1) {
      let filesTyp1 = event.target.files; 
      for (let file of filesTyp1) {
        if (file.size <= 2 * 1024 * 1024) { 
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.urls=e.target.result;
          };
          reader.readAsDataURL(file);
        } else {
          alert('Ảnh không được quá 2MB');
        }
      }
    }
    if(type === 0) {
      this.viewImg_dd = [];
      this.fileListImg = event.target.files;
      this.modelEdit.imageRepresent = this.fileListImg[0].name;
      for (let file of this.fileListImg) {
        if (file.size <= 2 * 1024 * 1024) {
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.viewImg_dd.push(e.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          alert('Ảnh không được quá 2MB');
        }
      }
    }
   
  }
  
  onSelectFile(fileInput: any) {
    this.selectedFiles = <FileList>fileInput.target.files;
    this.arrCovertFrom = Array.from(this.selectedFiles);

    console.log(this.selectedFiles);
    console.log(this.arrCovertFrom);
    
    
  }
      
}