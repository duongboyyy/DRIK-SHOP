import { HoaDon1Service } from '../hoadon1.service';
import { Component, EventEmitter, Injector, OnInit, Output, Input } from '@angular/core';
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { SanPhamBienThe1Service } from '../../san-pham-bien-thes/san-pham-bien-the1.service';
import { DvhcService } from '../../../../../services/dvhc.service';
import { HoaDonService } from '../hoadon.service';

@Component({
  selector: 'app-hoa-don-add',
  templateUrl: './hoa-don-add.component.html',
  styleUrls: ['./hoa-don-add.component.scss']
})
export class HoaDonAddComponent extends SecondPageEditBase implements OnInit {
  selectedProducts: any[] = [];
  [x: string]: any;
  list_tinh_thanh: any;
  list_quan_huyen: any;
  list_xa_phuong: any;
  Tinh: string;
  Xa: string;
  Huyen: string;
  page = 1;
  limit = 20;
  sortField = "";
  searchPro:string = "";
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  submitted = false;
  pageSize = 10;
  pageIndex = 0;
  totalBill = 0;
  searchModel: any = {
    key: '',
  };
  typePay: number;
  dataSource: any = [];
  payed_options = [];
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private service: HoaDon1Service,
    private service1: HoaDonService,
    private spbtservice: SanPhamBienThe1Service,
    private dvhcService: DvhcService
  ) {
    super(null, _injector);
  }
  modelEdit: any = {};
  formGroup: FormGroup;
  @Input() hoaDonId!: number;
  trangThai!: number;

  hd: any = {};
  async showPopup(id: any) {
    this.isShow = true;


  }

  closeForm() {
    this.isShow = false;
  }
  async ngOnInit() {
    this.modelEdit.LoaiDon = 0;
    this.formGroup = new FormGroup({
      Name: new FormControl('', Validators.compose([Validators.required])),
      Phone: new FormControl('', Validators.compose([Validators.required])),
      Address: new FormControl(''),
      Tinh: new FormControl('', Validators.compose([Validators.required])),
      Huyen: new FormControl('', Validators.compose([Validators.required])),
      Xa: new FormControl('', Validators.compose([Validators.required])),
      IsActive: new FormControl(''),
      LoaiThanhToan: new FormControl(''),
    });
    await this.getTinhThanh()
    await this.getData();
    this.payed_options.push({ label: '-- Thanh Toán --', value: null });
    this.payed_options.push({ label: 'Tiền mặt', value: 1 });
    this.payed_options.push({ label: 'Chuyển khoản', value: 2 });
  }
  async getData(event?: any) {
    this.isLoading = true;

    // Gán phân trang và sắp xếp nếu có sự kiện từ p-table
    if (event) {
      this.page = event.first / event.rows + 1;
      this.limit = event.rows;
      this.sortField = event.sortField || '';
    }

    try {
      const res = await this.spbtservice.Gets(
        this.searchPro,
        (this.page - 1) * this.limit,
        this.limit,
        this.sortField,
      );

      if (res.status) {
        this.dataSource = res.data;
        this.total = res.totalRecord;
      }
    } catch (error) {
      this._notifierService.showHttpUnknowError();
    } finally {
      this.isLoading = false;
    }
  }
  onSearch() {
    this.page = 1;
    console.log(this.searchPro) // reset về trang đầu
    this.getData({
      first: 0,
      rows: this.limit,
      sortField: this.sortField,
    });
  }
  save() {
    this.submitted = true;
    if (this.formGroup.valid) {
      const payload = {
        TenKhachHang: this.modelEdit.name,
        SDT: this.modelEdit.phone,
        Tinh: this.Tinh,
        Huyen: this.Huyen,
        Xa: this.Xa,
        LoaiDon: 1,
        ChitietHoaDons: this.selectedProducts,
        TongTien: this.totalBill,
        LoaiThanhToan: this.modelEdit.loaiThanhToan,
      };

      this.service1.post(payload).subscribe(
        re => {
          if (re.status) {
            this.serviceToast.showToastSuaThanhCong();
            this.onSaved.emit(re.data);
          }
          else {
            this.serviceToast.showToastCofigError(re.message);
          }
        }
      );

      this.isShow = false;
    }

  }

  CheckPayment(event: any) {
    this.isPayment = event;
  }

  async getTinhThanh(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dvhcService.getTinhThanh().subscribe(
        (res) => {
          this.list_tinh_thanh = res;
          resolve(); // Hoàn thành Promise
        },
        (err) => {
          console.error('Lỗi khi tải danh sách tỉnh/thành phố:', err);
          reject(err); // Từ chối Promise nếu có lỗi
        }
      );
    });
  }

  async changTinhThanh(event: any) {
    if (!this.list_tinh_thanh || this.list_tinh_thanh.length === 0) {
      console.error('Danh sách tỉnh/thành phố chưa được tải.');
      return;
    }

    this.Tinh = event;
    const tinh = event;
    const search = this.list_tinh_thanh.find((d) => d.name === tinh);
    if (search) {
      this.list_quan_huyen = search.districts;
      this.Huyen = null; // Reset giá trị quận/huyện
      this.Xa = null; // Reset giá trị phường/xã
    } else {
      console.error('Không tìm thấy tỉnh/thành phố:', tinh);
    }
  }

  async changHuyenQuan(event: any) {
    if (!this.list_quan_huyen || this.list_quan_huyen.length === 0) {
      console.error('Danh sách quận/huyện chưa được tải.');
      return;
    }

    this.Huyen = event;
    const huyen = event;
    const search = this.list_quan_huyen.find((d) => d.name === huyen);
    if (search) {
      this.list_xa_phuong = search.wards;
      this.Xa = null; // Reset giá trị phường/xã
    } else {
      console.error('Không tìm thấy quận/huyện:', huyen);
    }
  }
  removeProduct(i: number) {

    this.selectedProducts.splice(i, 1);
    this.updateTotalBill();

  }
  them(row) {
    console.log(row)
    
    const existing = this.selectedProducts.find(p => p.id_SanPhamBienThe === row.id);
    console.log(existing)
    if (!existing) {
      this.selectedProducts.push({
        id: row.id,
        id_SanPhamBienThe: row.id,
        id_SanPham: row.id_SanPham,
        tenSanPham: row.tenSanPham,
        Mau: row.maMau,
        Size: row.tenSize,
        soLuongTon: row.soLuongTon,
        soLuong: 1, // cho phép chỉnh sau, mặc định là 1
        giaBan: row.khuyenMai,
        maLo: row.maLo,
        id_Kho: row.id_Kho,
        isPayed: true

      });
      this.updateTotalBill();
    } else {

      this.serviceToast.showToastCofigError("Sản phẩm đã đc thêm");
    }
  }
  updateTotalBill() {
    this.totalBill = 0;
    this.selectedProducts.forEach(prod => {
      console.log(prod)
      const soLuong = Number(prod.soLuong) || 0;
      const donGia = Number(prod.giaBan) || 0;
      this.totalBill += soLuong * donGia;

    });
  }

  ChangeValue() {

  }
}

