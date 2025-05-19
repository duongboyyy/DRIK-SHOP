import { Component, Injector, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CartService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/account/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DvhcService } from 'src/app/service/dvhc.service';
import { OrderService } from 'src/app/service/order.service';
import { VnpayService } from 'src/app/service/payment/vnpay.service';
import { PaymentType } from '../../constants/payment-type';
import { Product } from 'src/app/model/product.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  list_item: any;
  tongtien: any;
  Tinh: string;
  Xa: string;
  Huyen: string;
  MaGiamGia: string;
  public DiaChi: string;
  public GhiChu: string = '';
  list_MGG: any;
  list_MGGSD: string[];
  check: any;
  check_sudung: any;
  tongThanhToan: any;
  list_tinh_thanh: any;
  list_quan_huyen: any;
  list_xa_phuong: any;
  id_user: string;
  checkAddressDefault: boolean = false;
  public checkdiachi: boolean
  public soLuong: number;
  public DiaChiDefaul: string;
  modelCart: any = {};
  paymentMethods = {
    cashOnDelivery: false,
    vnpay: false
  };
  isApplied: boolean = false;
  PaymentType: any;
  IsPayed: boolean = false;
  paymentModelInfomation = {

  }

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    protected _injector: Injector,
    public http: HttpClient,
    private cartService: CartService,
    private userService: UserService,
    private dvhcService: DvhcService,
    private orderService: OrderService,
    private vnPayService: VnpayService,
    private route: ActivatedRoute,
    public router: Router
  ) {
  }
  
  async ngOnInit() {
    
      // Lấy `status` từ URL query parameter
      this.route.queryParams.subscribe(params => {
        const status = params['status'];
  
        if (status === 'success') {
          // Nếu thanh toán thành công
          Swal.fire('Đặt hàng thành công.', '', 'success').then(() => {
            localStorage.removeItem('products');
            this.router.navigate(['/history']);
          });
        } else if (status === 'failure') {
          Swal.fire('Đặt hàng thất bại.', 'Vui lòng thử lại hoặc liên hệ hỗ trợ.', 'error').then(() => {
            this.router.navigate(['/cart']);
          });
        }
      });
    

    this.formGroup = this.formBuilder.group({
      tinh: [''],
      huyen: [''],
      xa: [''],
      diaChi: [''],
      ghiChu: [''],
      tongTien: [''],
      id_user: ['']
    });

    this.userService.checkLogin();
    this.id_user = localStorage.getItem('idUser');
    this.Tinh = null;
    await this.getTinhThanh();
    // this.http.post(environment.URL_API + "Carts/getCart/" + this.id_user, {}).subscribe(
    //   res => {
    //     this.list_item = res;
    //     console.log(this.list_item)
    //     this.tongtien = 0;
    //     for (let i = 0; i < this.list_item.length; i++) {
    //       this.tongtien = this.tongtien + (this.list_item[i].productDetail.giaBan * this.list_item[i].soLuong);
    //       this.tongThanhToan = this.tongtien + 25000;
    //     }

    //   });
    this.loadCart();//
    this.http.get(`${environment.URL_API}hoadons/magiamgia`).subscribe(
      (res: any) => {
        if (res.status && res.data) {
          this.list_MGG = res.data.filter(mgg => mgg.isActive && !mgg.isDelete); // Lọc mã hợp lệ
        } else {
          this.list_MGG = []; // Trường hợp không có mã hợp lệ
        }
      },
      (error: any) => {
        console.error("Lỗi khi lấy danh sách mã giảm giá:", error);
        this.list_MGG = []; // Xử lý khi có lỗi
      }
    );
    //this.checkdiachi=true;
    this.list_MGGSD = [];
    this.check = null;
    this.http.post(environment.URL_API + "Auth/getDiaChi/", {
      id_user: this.id_user
    }).subscribe(
      res => {
        this.DiaChiDefaul = <string>res;
        this.DiaChi = this.DiaChiDefaul;
      }
    );
    this.checkdiachi = true;
  }



  changeValue(value) {
    this.checkdiachi = !value;
    if (this.check) {
      this.DiaChi = this.DiaChiDefaul;
    }
    else {
      this.DiaChi = '';
    }
  }
  deleteSanPham(item): void {
    const clicks = localStorage.getItem('idUser');
    let delproduct: deleteProduct = new deleteProduct()
    delproduct.id_sanpham = item.idSanPhamBienThe
    delproduct.user_ID = clicks
    console.log(delproduct)
    this.http.post(environment.URL_API + "Carts/delete", delproduct
    ).subscribe(
      res => {
        Swal.fire("Xoá sản phẩm thành công .", '', 'success')
        this.cartService.LoadCart();
        this.http.post(environment.URL_API + "Carts/getCart/" + clicks, {}).subscribe(
          (updatedCart: Product[]) => {
            this.list_item = updatedCart;
            this.tongtien = 0;
            this.updateCartTotal();
            this.cartService.DeleteProduct(item.productDeatail);
            this.cartService.itemsSubject.next(updatedCart);
          });
      })
  }
  loadCart() {
    this.http.post(environment.URL_API + "Carts/getCart/" + this.id_user, {}).subscribe(
      (res: any[]) => {
        this.list_item = res.map(item => {
          // Mặc định tất cả sản phẩm được chọn
          return { ...item, selected: true };
        });
        console.log('cart',this.list_item)
        this.updateCartTotal();
      },
      err => {
        console.error(err);
      }
    );
  }
  updatecart(item): void {
    let delproduct: deleteProduct = new deleteProduct()
    delproduct.id_sanpham = item.idSanPhamBienThe
    console.log(delproduct)
    console.log('cart',this.list_item)
    console.log(localStorage.getItem('products'))
    this.updateCartTotal();
  }

  updateCartTotal() {
    this.tongtien = 0;
    for (let item of this.list_item) {
      if (item.selected) {
        this.tongtien += item.productDetail.khuyenMai * item.soLuong;
      }
    }
    this.tongThanhToan = this.tongtien; // Thêm phí vận chuyển.
  }
  maGiamGia(): void {
    if (localStorage.getItem("products") === null) {
      Swal.fire("Giỏ hàng trống.", '', 'warning').then(function () {
      }
      )
    }
    else {
      this.check = this.list_MGG.filter(d => d.code == this.MaGiamGia)[0];
      //this.check_sudung = this.list_MGGSD.filter(d=>d==this.MaGiamGia)[0];
      if (this.check != null) {
        //this.list_MGGSD.push(this.MaGiamGia)
        this.tongThanhToan = this.tongtien - this.check.soTienGiam;
        Swal.fire("Áp dụng mã giảm giá thành công .", '', 'success')
        if (this.check.soLuong > 0) { // Kiểm tra số lượng mã giảm giá
          this.list_MGGSD.push(this.MaGiamGia);
          this.tongThanhToan = this.tongtien  - this.check.soTienGiam;

          // Gọi API để giảm số lượng mã giảm giá
          this.http.put(`${environment.URL_API}hoadons/magiamgia?id=${this.check.id}`, null)
            .subscribe(
              (res: any) => {
                Swal.fire("Áp dụng mã giảm giá thành công.", '', 'success');
              },
              (error: any) => {
                Swal.fire("Có lỗi xảy ra khi cập nhật mã giảm giá.", '', 'error');
              }
            );
        } else {
          Swal.fire("Mã giảm giá đã hết.", '', 'error');
        }
      }
      else {
        // if(this.check_sudung==this.MaGiamGia)
        // {
        //   Swal.fire("Bạn đã áp mã này rồi.", '', 'error')
        // }
        // else
        // {
        Swal.fire("Mã giảm giá không tồn tại .", '', 'error')
        // }
      }
    }
  }
  
  ChangeSoLuong(cartID, i) {
    const clicks = localStorage.getItem('idUser');
    this.http.post(environment.URL_API + "Carts/update/", {
      CartID: cartID,
      SoLuong: this.soLuong,
      UserID: clicks
    }).subscribe(
      res => {
        this.list_item = res;
        this.tongtien = 0;
        for (let i = 0; i < this.list_item.length; i++) {
          this.tongtien = this.tongtien + (this.list_item[i].productDetail.khuyenMai * this.list_item[i].soLuong);
          this.tongThanhToan = this.tongtien ;
        }
      }
    );
    this.tongThanhToan = this.tongtien  - this.check.soTienGiam;
  }
  updateCongSanPham(cartID, soLuong) {
    const clicks = localStorage.getItem('idUser');
    this.http.post(environment.URL_API + "Carts/update/", {
      CartID: cartID,
      SoLuong: soLuong + 1,
      UserID: clicks
    }).subscribe(
      res => {
        this.list_item = res;
        this.tongtien = 0;
        for (let i = 0; i < this.list_item.length; i++) {
          this.list_item[i].selected=true
          this.tongtien = this.tongtien + (this.list_item[i].productDetail.khuyenMai * this.list_item[i].soLuong);
          this.tongThanhToan = this.tongtien ;
        }
      }
    );
    // this.tongThanhToan = this.tongtien + 25000 - this.check.soTienGiam;
  }
  updateTruSanPham(cartID, soLuong) {
    const clicks = localStorage.getItem('idUser');
    if (soLuong >= 2) {
      soLuong = soLuong - 1;
    }
    // else {
      
    // }
    this.http.post(environment.URL_API + "Carts/update/", {
      CartID: cartID,
      SoLuong: soLuong,
      UserID: clicks
    }).subscribe(
      res => {
        this.list_item = res;
        this.tongtien = 0;
        for (let i = 0; i < this.list_item.length; i++) {
          this.list_item[i].selected=true
          this.tongtien = this.tongtien + (this.list_item[i].productDetail.khuyenMai * this.list_item[i].soLuong);
          this.tongThanhToan = this.tongtien ;
        }
      }
    );
    // this.tongThanhToan = this.tongtien + 25000 - this.check.soTienGiam;
  }

  async getTinhThanh() {
    this.dvhcService.getTinhThanh().subscribe(
      (res) => {
        this.list_tinh_thanh = res;
      },
      (err) => {
      }
    );
  }

  changTinhThanh(event: any) {
    this.Tinh = event;
    const tinh = event;
    const search = this.list_tinh_thanh.filter(d => d.name === tinh)[0];
    this.list_quan_huyen = search.districts;
    this.Huyen = null;
    this.Xa = null;
  }

  changHuyenQuan(event: any) {
    this.Huyen = event;
    const Huyen = event;
    const search = this.list_quan_huyen.filter(d => d.name === Huyen)[0];
    this.list_xa_phuong = search.wards;
    this.Xa = null;
  }

  checkAddress(event: any) {
    console.log(this.checkAddressDefault);
  }

  //payment vnpay
  selectPaymentMethod(method: 'cashOnDelivery' | 'vnpay'): void {
    for (const key in this.paymentMethods) {
      if (this.paymentMethods.hasOwnProperty(key)) {
        this.paymentMethods[key] = false;
      }
    }
    this.paymentMethods[method] = true;
  }

  async onSubmit() {
    if (!localStorage.getItem("products") || JSON.parse(localStorage.getItem("products")).length === 0) {
      Swal.fire("Giỏ hàng trống.", '', 'warning');
      console.log('cart', localStorage.getItem("products"));
      return;
    }
  
    if (!this.paymentMethods.cashOnDelivery && !this.paymentMethods.vnpay) {
      Swal.fire("Vui lòng chọn phương thức thanh toán.", '', 'warning');
      return;
    }
  
    if (this.tongtien == 0) {
      Swal.fire("Vui lòng chọn sản phẩm bạn muốn mua", '', 'warning');
      return;
    }
  
    const spOrder: number[] = this.list_item
      .filter(item => item.selected)
      .map(item => {
        this.cartService.DeleteProduct(item.productDeatail);
        return item.cartID;
      });
  
    const curUserId = localStorage.getItem('idUser');
  
    const invoiceModel = {
      Tinh: this.Tinh,
      Huyen: this.Huyen,
      Xa: this.Xa,
      DiaChi: this.DiaChi,
      GhiChu: this.GhiChu,
      TongTien: this.tongThanhToan,
      Id_User: curUserId,
      LoaiThanhToan: null,
      IsPayed: null,
      TrangThai: null, // Trạng thái đơn hàng
      SpOrder: spOrder,
    };
  
    if (this.paymentMethods.cashOnDelivery) {
      invoiceModel.LoaiThanhToan = PaymentType.COD;
      invoiceModel.IsPayed = false;
      invoiceModel.TrangThai = 0; // Chờ xác nhận
  
      this.http.post(environment.URL_API + "hoadons/", invoiceModel).subscribe({
        next: (res) => {
          Swal.fire("Đặt hàng thành công.", '', 'success').then(() => {
            this.router.navigate(['/history']);
            this.cartService.LoadCart();
          });
        },
        error: (err) => {
          Swal.fire("Lỗi", "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.", 'error');
        }
      });
  
    } else if (this.paymentMethods.vnpay) {
      invoiceModel.LoaiThanhToan = PaymentType.Vnpay;
      invoiceModel.IsPayed = false;
      invoiceModel.TrangThai = 5;
  
      this.http.post(environment.URL_API + "hoadons/", invoiceModel).subscribe({
        next: (res: any) => {
          console.log("Hóa đơn đã tạo thành công:", res.data);
          this.createPayment(res.data);
        },
        error: (err) => {
          Swal.fire("Lỗi", "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.", 'error');
        }
      });
    }
  }
  
  async createPayment(invoiceModel: any) {

    this.paymentModelInfomation = {
      amount: invoiceModel.tongTien,
      tongTien: invoiceModel.tongTien,
      orderType: 'other',
      orderDescription: 'đã thanh toán đơn hàng',
      name: "bạn",
      ghiChu: invoiceModel.ghiChu,
      trangThai: invoiceModel.trangThai,
      loaiThanhToan: invoiceModel.loaiThanhToan,
      isPayed: invoiceModel.isPayed,
      tinh:invoiceModel.tinh,
      huyen: invoiceModel.huyen,
      xa: invoiceModel.xa,
      diaChi: invoiceModel.diaChi,
      id_User: invoiceModel.id_User,
      idHoaDon: invoiceModel.id,
      //listProductOrder: this.list_item.filter(item => item.selected).map(item => item.cartID)
    };
  
    console.log(this.paymentModelInfomation);
  
    await this.vnPayService.Save(this.paymentModelInfomation).then(re => {
      window.location.href = re.data;
    }).catch(err => {
      console.error("Error creating payment:", err);
    });
  }
  
  

}
export class deleteProduct {
  id_sanpham: number
  user_ID: string
}
