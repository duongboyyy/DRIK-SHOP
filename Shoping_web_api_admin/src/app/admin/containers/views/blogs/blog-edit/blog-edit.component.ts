import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core'; 
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { BrandService } from '../../brands/brand.service';
import { NhaCungCapService } from '../../nhacungcaps/nhacungcap.service';
import { Category1Service } from '../../categories/category1.service';
import { NhaCungCap1Service } from '../../nhacungcaps/nhacungcap1.service';
import { Brand1Service } from '../../brands/brand1.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Blog1Service } from '../blog1.service';
@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.scss']
})
export class BlogEditComponent  extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  
  modelEdit: any = {};
  urls = new Array<string>();
  viewImg_dd = new Array<string>();
  //selectedFiles: FileList;
  selectedFiles: File[] = [];

  fileListImg: any;
  arrCovertFrom: any[] = [];
  deletedImages: string[] = [];
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    public serviceToast: ToastServiceService,
    private _product1Service: Blog1Service,
  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      tieuDe: new FormControl('', Validators.compose([Validators.required])),
      noiDung: new FormControl('', Validators.compose([Validators.required])),
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
            this.urls.push(e.target.result);
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
    const newFiles = Array.from(fileInput.target.files) as File[]; // Lấy các tệp mới được chọn
    this.arrCovertFrom = [...this.arrCovertFrom, ...newFiles]; // Thêm tệp mới vào danh sách hiện tại
    console.log("Current Files:", this.arrCovertFrom); // Debug để xem danh sách tệp hiện tại
}


  removeImage(index: number, type) { 
    if (type === 1) {
      if (index >= 0 && index < this.urls.length) {
        this.deletedImages.push(this.arrCovertFrom[index]); 
        this.urls.splice(index, 1);
        this.arrCovertFrom.splice(index, 1);
    }
    }
    if(type === 0) {
      this.viewImg_dd = [];
      this.viewImg_dd.splice(index, 1);
    }
  } 

  async showPopup(id: any) {
    this.isShow = true;
    this.deletedImages = [];
    if (id > 0) {
        this._product1Service.getDetail(id).then(re => {
            if (re.status) {
                this.modelEdit = re.data;
                this.modelEdit.id = id;
                this.urls = re.data.imageBlogs.map(image => this.getImageBlog(image.imageName));
                this.arrCovertFrom = re.data.imageBlogs.map(image => image.imageName); // Lưu tên ảnh để quản lý việc xóa
            }
        });
    } else {
        this.modelEdit = {};
        this.modelEdit.id = 0;
        this.urls = [];
        this.arrCovertFrom = [];
    }
}

save() {
  this.submitted = true;
  if (this.formGroup.valid) {
      const formData = new FormData();
      const item = {
          id: this.modelEdit.id,
          tieuDe: this.modelEdit.tieuDe,
          noiDung: this.modelEdit.noiDung,
          //deletedImages: this.deletedImages.join(',')
      };

      for (const key in item) {
          formData.append(key, item[key]);
      }
      if (this.deletedImages.length > 0) {
        this.deletedImages.forEach(image => formData.append('DeletedImages', image));
    }
      if (this.arrCovertFrom != null) {
          for (let i = 0; i < this.arrCovertFrom.length; i++) {
              formData.append('files', this.arrCovertFrom[i]);
          }
      }

      this._product1Service.Save(formData).subscribe(re => {
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
