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
import { Product1Service } from '../product1.service';
import { CtkmsComponent } from '../../ctkms/ctkms.component';
import { CtkmsService } from '../../ctkms/ctkms.service';
@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent  extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;

  category_options = [];
  supplier_options = [];
  brand_options = [];
  ctkm_options = [];
  productState_options = [
    {label: '-- Loại sản phẩm --'},
    {label : 'Sản phẩm thường', value: 'thuong'},
    {label : 'Sản phẩm hot', value: 'hot'},
    {label : 'Sản phẩm mới', value: 'new'},
    {label : 'Sản phẩm khuyến mãi', value: 'sale'}
  ];
  gender_options = [
    {label: '-- Giới tính --'},
    {label : 'Nam', value: 1},
    {label : 'Nữ', value: 2},
  ];
  state_options = [{label: '-- Trạng thái --'},{label: 'Hiển thị', value : true}, {label : 'Ẩn', value: false}];
  tag_options = [{label: '-- Tags --'}, {label: 'Fashion', value: 'Fashion'}, {label: 'Casual', value: 'Casual'}, {label : 'Vintage', value : 'Vintage'}, {label : 'Features', value: 'Features'},{label : 'Unisex', value: 'Unisex'}];
  modelEdit: any = {};
  urls = new Array<string>();
  viewImg_dd = new Array<string>();
  // selectedFiles: FileList;
  selectedFiles: File[] = [];

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
    private _ctkmsService:CtkmsService
  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      ten: new FormControl('', Validators.compose([Validators.required])),
      giaBan: new FormControl('', Validators.compose([Validators.required])),
      giaNhap: new FormControl('', Validators.compose([Validators.required])),
      khuyenMai: new FormControl(''),
      moTa: new FormControl(''),
      huongDan: new FormControl(''),
      thanhPhan: new FormControl(''),
      tag: new FormControl(''),
      imageRepresent: new FormControl(''),
      id_Loai: new FormControl('', Validators.compose([Validators.required])),
      id_NhaCungCap: new FormControl(''),
      id_NhanHieu: new FormControl(''),
      id_CTKM:new FormControl(''),
      trangThaiSanPham: new FormControl('', Validators.compose([Validators.required])),
      trangThaiHoatDong: new FormControl('', Validators.compose([Validators.required])),
      gioiTinh: new FormControl(''),
      deletedImages: new FormControl(''),
    });
    await this.loadSup();
    await this.loadCate();
    await this.loadBrand();
    await this.loadCTKM();
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
  async loadCTKM() {
    this.ctkm_options=[{label: '-- Chương trình khuyến mại --', value: 0}];
    await this._ctkmsService.GetTenCTKM().subscribe(rs => {
        if (rs.status) {
          console.log(rs.data);
            rs.data.forEach(item => {
                this.ctkm_options.push({ label: item.name, value: item.id });
            });
        }
    });
  }
  async loadSup() {
    this.supplier_options = [{label: '-- Nhà cung cấp --'}];
    await this._serviceNhaCungCap1.Gets('', 0, 1000, "").then(rs => {
        if (rs.status) {
            rs.data.forEach(item => {
                this.supplier_options.push({ label: item.ten, value: item.id });
            });
        }
    });
  }

  async loadBrand() {
    this.brand_options = [{label: '-- Nhãn hiệu --'}];
    await this._serviceBrand1.Gets('', 0, 1000, "").then(rs => {
        if (rs.status) {
            rs.data.forEach(item => {
                this.brand_options.push({ label: item.ten, value: item.id });
            });
        }
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
                this.urls = re.data.imageSanPhams.map(image => this.getImage(image.imageName));
                console.log(this.modelEdit)
                this.arrCovertFrom = re.data.imageSanPhams.map(image => image.imageName); // Lưu tên ảnh để quản lý việc xóa
                this._product1Service.GetCTKMByIdProduct(id).then(re=>{
                  this.modelEdit.id_CTKM=re.data.id
                });
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
          ten: this.modelEdit.ten,
          giaBan: this.modelEdit.giaBan,
          giaNhap: this.modelEdit.giaNhap,
          moTa: this.modelEdit.moTa,
          huongDan: this.modelEdit.huongDan,
          imageRepresent: this.modelEdit.imageRepresent,
          thanhPhan: this.modelEdit.thanhPhan,
          tag: this.modelEdit.tag,
          khuyenMai: this.modelEdit.id_ctkm == null  ? this.modelEdit.giaBan  : this.modelEdit.khuyenMai,
          id_Loai: this.modelEdit.id_Loai,
          id_NhaCungCap: this.modelEdit.id_NhaCungCap,
          id_NhanHieu: this.modelEdit.id_NhanHieu,
          id_CTKM:this.modelEdit.id_CTKM || 0,
          trangThaiHoatDong: this.modelEdit.trangThaiHoatDong,
          trangThaiSanPham: this.modelEdit.trangThaiSanPham,
          gioiTinh: this.modelEdit.gioiTinh,

          // deletedImages: this.deletedImages.join(',')
      };
      console.log("fix",item)

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
