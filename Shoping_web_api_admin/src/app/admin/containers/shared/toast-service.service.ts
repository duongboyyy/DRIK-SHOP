import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {
  constructor(    public toastr: ToastrService,) { }
  showToastDonHangTaoThanhCong(){
    this.toastr.success("Đơn hàng tạo thành công")
  }
  showToastThemThanhCong(){
    this.toastr.success("Thêm thành công")
  }
  showToastSuaThanhCong(){
    this.toastr.success("Cập nhật thành công")
  }
  showToastThemThatBai(){
    this.toastr.error("Thêm thất bại")
  }
  showToastSuaThatBai(){
    this.toastr.error("Cập nhật thất bại")
  }
  showToastXoaThanhCong(){
    this.toastr.success("Xóa thành công")
  }
  showToastXoaThatBai(){
    this.toastr.error("Xóa thất bại")
  }
  showToastDangNhapThanhCong(){
    this.toastr.success("Đăng nhập thành công")
  }
  showToastDangNhapThatBai(){
    this.toastr.error("Đăng nhập thất bại")
  }
  showToastQuyen(){
    this.toastr.error("Bạn không có quyền vào chức năng này")
  }
  showToastDaThem(){
    this.toastr.error("Sản phẩm đã được thêm")
  }
  showToastTao(){
    this.toastr.error("Mật khẩu không khớp")
  }
  showToastCofigSuccess(toast: string) {
    this.toastr.success(toast);
  }
  showToastCofigError(toast: string) {
    this.toastr.error(toast);
  }

  showToastCofigWarming(toast: string) {
    this.toastr.warning(toast);
  }

}
