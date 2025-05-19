import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { TaoPhieuNhapService } from '../tao-phieu-nhap.service';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { TaoPhieuNhap1Service } from '../tao-phieu-nhap1.service';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-tao-phieu-nhap-detail',
  templateUrl: './tao-phieu-nhap-detail.component.html',
  styleUrls: ['./tao-phieu-nhap-detail.component.scss']
})
export class TaoPhieuNhapDetailComponent extends SecondPageEditBase  implements OnInit {
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();

  trangThai_options = [
    { label: '--Công nợ--', value: null },
    { label: 'Đã thanh toán', value: true },
    { label: 'Chưa thanh toán', value: false }];

  statementPayment: any = {
    id: -1,
    payment: null,
  }

  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private service: TaoPhieuNhap1Service
  ) {
    super(null,_injector);
  }
  formGroup: FormGroup;
  ngOnInit() {
    this.formGroup = new FormGroup({
    });
    
  }
  id:any
  
  modelEdit: any = {};
  async showPopup(id: any) {
    this.isShow = true; 
    this.service.getDetail(id).then(re => {
            this.modelEdit = re as any;
    });
    
    
}
exportGeneratePdf(id:any) {
  window.open(`https://localhost:44302/api/GeneratePdf/phieunhapdetail/${id}`, "_blank");
}
  closeForm() {
    this.isShow = false;
  }

  async onEditMutilple() {
    this.statementPayment.id = this.modelEdit.id;

    if(this.statementPayment.payment == null) {
      this.serviceToast.showToastCofigError("Vui lòng chọn trạng thái thanh toán");
    }

    if (confirm('Bạn có chắc chắn muốn cập nhật không?')) {
        const res = await this.service.UpdateCongNo(this.statementPayment).then(re => {
            if (re.status) {
              this.modelEdit.isPayment = re.data.isPayment;
              this.modelEdit.congNo = re.data.congNo;
              this.serviceToast.showToastCofigSuccess("Cập nhật thành công");
            } else {
              this.serviceToast.showToastCofigError("Lỗi");
            }
        });
    }

  }

  onChangePayment(event: any) {
    this.statementPayment.payment = event.value;

  }

}
