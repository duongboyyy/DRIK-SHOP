import { HoaDon1Service } from '../hoadon1.service';
import { Component, EventEmitter, Injector, OnInit, Output, Input } from '@angular/core';
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';

@Component({
  selector: 'app-hoa-don-edit',
  templateUrl: './hoa-don-edit.component.html',
  styleUrls: ['./hoa-don-edit.component.scss']
})
export class HoaDonEditComponent extends SecondPageEditBase implements OnInit {
  selectedProducts: any[] = [];
  [x: string]: any;
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  submitted = false;
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private service: HoaDon1Service
  ) {
    super(null, _injector);
  }
  modelEdit: any = {};
  formGroup: FormGroup;
  @Input() hoaDonId!: number;
  trangThai!: number;
  trangThaiOptions = [
    { label: 'Chờ xác nhận', value: 0 },
    { label: 'Đã xác nhận', value: 1 },
    { label: 'Hoàn thành', value: 2 },
    { label: 'Đã hủy', value: 3 },
    { label: 'Đang giao hàng', value: 4 },
    { label: 'Chờ thanh toán', value: 5 },
    { label: 'Yêu cầu hoàn hàng', value: 6 },
    { label: 'Xử lý đơn hoàn', value: 7 },
    { label: 'Hoàn hàng tất cả', value: 8 },
    { label: 'Hoàn hàng hủy', value: 9 },
    { label: 'Hoàn hàng một phần', value: 10 },
    { label: 'Hoàn hàng thành công', value: 11 }
  ];
  hd: any = {};
  async showPopup(id: any) {
    this.isShow = true;
    console.log(id)
    this.service.getDetailhoadon(id).then(re => {
      this.selectedProducts = [];
      this.modelEdit = re as any;
      this.hoaDonId = id;
      this.hd = this.modelEdit.hoaDon;
      console.log('dêtail', this.modelEdit)
    });


  }

  closeForm() {
    this.isShow = false;
  }
  ngOnInit() {
    this.formGroup = new FormGroup({
      trangThai: new FormControl('')
    });

  }

  save() {
    this.submitted = true;

    console.log(this.selectedProducts);
    //const trangThai = this.formGroup.get('trangThai')?.value.value; 
    const trangThai = this.hd.trangThai;
    console.log("Giá trị trangThai trước khi gửi:", trangThai, this.hd);
    const formData = new FormData();
    if (trangThai == null) {
      formData.append('TrangThai', this.hd.toString())
    }
    else {
      formData.append('TrangThai', trangThai.toString())
      const selectedListJson = JSON.stringify(this.selectedProducts);
      formData.append('ChiTietHoanHangs', selectedListJson);
      console.log('selectedListJson:', selectedListJson);
      this.service.Save(this.hoaDonId, formData).subscribe(
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
    }
    this.isShow = false;
  }

  onCheckboxChange(event: any, chiTiet: any, index: number) {
    if (event.target.checked) {
      chiTiet.isBack = true;
      chiTiet.soLuongDaHoan=1;
      const existing = this.selectedProducts.find(p => p.Id_ChiTietHoaDon === chiTiet.id);
      if (!existing) {
        this.selectedProducts.push({
          Id_ChiTietHoaDon: chiTiet.id,
          MaLo: chiTiet.MaLo,
          Id_Kho: chiTiet.Id_Kho,
          SoLuongHoan: chiTiet.selectedQuantity || 1,  // default là 1 nếu chưa chọn
          isBack: true
        });
      }
    } else {
      this.selectedProducts = this.selectedProducts.filter(p => p.Id_ChiTietHoaDon !== chiTiet.id);
      chiTiet.isBack = false;
      chiTiet.soLuongDaHoan=0;
    }
  }
  onCheckboxBackChange(event: any, chiTiet: any, index: number) {
    if (event.target.checked) {
      const existing = this.selectedProducts.find(p => p.Id_ChiTietHoaDon === chiTiet.id);
      if (!existing) {
        chiTiet.isRefund=true
        this.selectedProducts.push({
          Id_ChiTietHoaDon: chiTiet.id,
          MaLo: chiTiet.MaLo,
          Id_Kho: chiTiet.Id_Kho,
          SoLuongHoan: chiTiet.selectedQuantity || 1,  
          isBack: true 
        });
      } else {
        // Nếu đã có, cập nhật trường isBack = true
        existing.isBack = true;
      }
    } else {
      const existing = this.selectedProducts.find(p => p.Id_ChiTietHoaDon === chiTiet.id);
      if (existing) {
        existing.isBack = false;
      }
    }
  }

  onQuantityChange(event: any, chiTiet: any, index: number) {
    const quantity = parseInt(event.target.value, 10);
    chiTiet.SoLuongHoan = quantity;

    const existing = this.selectedProducts.find(p => p.Id_ChiTietHoaDon === chiTiet.id);
    if (existing) {
      existing.SoLuongHoan = quantity;
    }
    console.log(existing.SoLuongHoan)
  }

  onTrangThaiChange(event: any) {
    const trangThaiMoi = event.value;
  
    if (trangThaiMoi === 8 && this.modelEdit?.chiTietHoaDons?.length) {
      this.selectedProducts = [];
  
      this.modelEdit.chiTietHoaDons.forEach((chiTiet: any) => {
        chiTiet.isRefund = true;
        chiTiet.soLuongDaHoan = chiTiet.soLuong;
  
        this.selectedProducts.push({
          Id_ChiTietHoaDon: chiTiet.id,
          MaLo: chiTiet.MaLo,
          Id_Kho: chiTiet.Id_Kho,
          SoLuongHoan: chiTiet.soLuong
        });
      });
    } else {
      this.selectedProducts = [];
      this.modelEdit?.chiTietHoaDons?.forEach((chiTiet: any) => {
        chiTiet.isRefund = false;
        chiTiet.soLuongDaHoan = null;
      });
    }
  }
  

  exportGeneratePdf(id: any) {
    window.open(`https://localhost:44302/api/GeneratePdf/orderdetail/${id}`, "_blank");
  }

}

