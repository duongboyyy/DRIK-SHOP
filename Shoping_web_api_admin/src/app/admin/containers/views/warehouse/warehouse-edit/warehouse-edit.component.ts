import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { WarehouseService } from '../warehouse.service';
import { DvhcService } from '../../../../../services/dvhc.service';

@Component({
  selector: 'app-warehouse-edit',
  templateUrl: './warehouse-edit.component.html',
  styleUrls: ['./warehouse-edit.component.scss']
})
export class WarehouseEditComponent extends SecondPageEditBase implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  list_tinh_thanh: any;
  list_quan_huyen: any;
  list_xa_phuong: any;
  modelEdit: any = {};
  urls: string;
  fileListImg: any;
  arrCovertFrom: any[] = [];
  deletedImages: string[] = [];
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    public serviceToast: ToastServiceService,
    private _warehouseService: WarehouseService,
    private dvhcService: DvhcService
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      Name: new FormControl('', Validators.required),
      Address: new FormControl(''),
      Tinh: new FormControl('', Validators.required),
      Huyen: new FormControl('', Validators.required),
      Xa: new FormControl('', Validators.required),
      IsActive: new FormControl(''),
    });
    await this.getTinhThanh();
  }

  async showPopup(id: any) {
    this.isShow = true;
    this.deletedImages = [];
    if (id > 0) {
      await this._warehouseService.getDetail(id).then(re => {
        if (re.status) {
          this.modelEdit = re.data;
          this.modelEdit.id = id;

          this.formGroup.patchValue({
            Name: re.data.name,
            Tinh: re.data.tinh,
            Huyen: re.data.huyen,
            Xa: re.data.xa,
            Address: re.data.diaChi
          });

          this.changeTinhThanh(re.data.tinh);
          this.changeHuyenQuan(re.data.huyen);

          console.log(this.modelEdit);
        }
      });
    } else {
      this.modelEdit = {};
      this.modelEdit.id = 0;
      this.formGroup.reset();
      this.urls = "";
    }
  }

  save() {
    this.submitted = true;
    if (this.formGroup.valid) {
      const formData = new FormData();
      const formValue = this.formGroup.value;

      const item = {
        id: this.modelEdit.id,
        Name: formValue.Name,
        Tinh: formValue.Tinh,
        Huyen: formValue.Huyen,
        Xa: formValue.Xa,
        Address: formValue.Address || null,
      };

      for (const key in item) {
        formData.append(key, item[key]);
      }

      if (this.arrCovertFrom?.length) {
        formData.append('files', this.arrCovertFrom[this.arrCovertFrom.length - 1]);
      }

      this._warehouseService.Save(formData).subscribe(re => {
        if (re.status) {
          this.modelEdit.id > 0 ? this.serviceToast.showToastSuaThanhCong() : this.serviceToast.showToastThemThanhCong();
          this.onSaved.emit(re.data);
          this.isShow = false;
        } else {
          this.serviceToast.showToastSuaThatBai();
          this.isShow = true;
        }
      });
    }
  }

  closeForm() {
    this.isShow = false;
  }

  async getTinhThanh(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dvhcService.getTinhThanh().subscribe(
        (res) => {
          this.list_tinh_thanh = res;
          resolve();
        },
        (err) => {
          console.error('Lỗi khi tải danh sách tỉnh/thành phố:', err);
          reject(err);
        }
      );
    });
  }

  async changeTinhThanh(tinhName: string) {
    if (!this.list_tinh_thanh?.length) return;

    const search = this.list_tinh_thanh.find(d => d.name === tinhName);
    if (search) {
      this.list_quan_huyen = search.districts;
      this.formGroup.patchValue({ Huyen: null, Xa: null });
      this.list_xa_phuong = [];
    }
  }

  async changeHuyenQuan(huyenName: string) {
    if (!this.list_quan_huyen?.length) return;

    const search = this.list_quan_huyen.find(d => d.name === huyenName);
    if (search) {
      this.list_xa_phuong = search.wards;
      this.formGroup.patchValue({ Xa: null });
    }
  }
}
