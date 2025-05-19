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

@Component({
  selector: 'app-ctkms-edit',
  templateUrl: './ctkms-edit.component.html',
  styleUrls: ['./ctkms-edit.component.scss']
})
export class CtkmsEditComponent extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;

 
  brand_options = [];

  DiscountType_options = [
    {label: '-- Loại giảm giá --'},
    {label : '%', value: "1"},
    {label : 'VNĐ', value: "2"},
  ];
  modelEdit: any = {};
  urls :string;
  viewImg_dd = new Array<string>();
  // selectedFiles: FileList;
  selectedFiles: FileList;
  startDate: Date;
  endDate:Date;
  fileListImg: any;
  arrCovertFrom: any[] = [];
  deletedImages: string[] = [];
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    public serviceToast: ToastServiceService,
    public serviceCategory: Category1Service,
    public serviceBrand: BrandService,
    public serviceNhaCungCap:NhaCungCapService,
    private _serviceNhaCungCap1: NhaCungCap1Service,
    private _product1Service: Product1Service,
    private _serviceBrand1: Brand1Service,
    private _ctkmsService: CtkmsService
  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      Name: new FormControl('', Validators.compose([Validators.required])),
      Description: new FormControl(''),
      StartDate: new FormControl(this.modelEdit?.startDate||'' ),
      EndDate: new FormControl(this.modelEdit?.endDate||''),
      DiscountType: new FormControl('',Validators.compose([Validators.required])),
      imageRepresent: new FormControl(''),
      DiscountValue: new FormControl('',Validators.compose([Validators.required])),
      deletedImages: new FormControl(''),
    });

  }


  
  handleFileInput(event: any): void {
    this.detectFiles(event, 0);
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
  
  // onSelectFile(fileInput: any) {
  //   this.selectedFiles = <FileList>fileInput.target.files;
  //   this.arrCovertFrom = Array.from(this.selectedFiles);
  // }
  onSelectFile(fileInput: any) {
    this.selectedFiles = <FileList>fileInput.target.files;
    this.arrCovertFrom = Array.from(this.selectedFiles);

    console.log(this.selectedFiles);
    console.log(this.arrCovertFrom);
    
    
  }

  

  async showPopup(id: any) {
    this.isShow = true;
    this.deletedImages = [];
    if (id > 0) {
        await this._ctkmsService.getDetail(id).then(re => {
            if (re.status) {
               
                this.modelEdit = re.data;
                this.modelEdit.id = id;
                //this.urls = re.data.imageSanPhams.map(image => this.getImage(image.imageName));
                this.urls=this.getImageCTKM(re.data.image);
                //this.arrCovertFrom = re.data.imageSanPhams.map(image => image.imageName); // Lưu tên ảnh để quản lý việc xóa
                this.modelEdit.startDate = new Date(this.modelEdit.startDate);
                this.modelEdit.endDate = new Date(this.modelEdit.endDate);
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
    if (this.arrCovertFrom != null) {
      
      formData.append('files', this.arrCovertFrom[this.arrCovertFrom.length-1]);
      
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
