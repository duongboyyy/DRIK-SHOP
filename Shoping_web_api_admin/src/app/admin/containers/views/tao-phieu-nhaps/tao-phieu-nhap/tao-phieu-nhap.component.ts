import { __values } from 'tslib';

import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { TaoPhieuNhapService } from '../tao-phieu-nhap.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { TaoPhieuNhap1Service } from '../tao-phieu-nhap1.service';
import { NhaCungCap } from '../../nhacungcaps/nhacungcap.service';
import { WarehouseService } from '../../../../../services/warehouse.service';
@Component({
  selector: 'app-tao-phieu-nhap',
  templateUrl: './tao-phieu-nhap.component.html',
  styleUrls: ['./tao-phieu-nhap.component.scss'],
  // providers: [{
  //   provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  // }]
})
export class TaoPhieuNhapComponent extends SecondPageEditBase implements OnInit {
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private serviceD: TaoPhieuNhap1Service,
    private service: TaoPhieuNhapService,
    private WareHouseService: WarehouseService,
  ) {
    super(null,_injector);
  }
  formGroup: FormGroup;
  chitiets: any=[]
  nhacungcaps: any[] = [];
  sanphams: any[] = [];
  sanphambienthes: any[] = [];
  motnhacungcap:any
  list_warehouse: any[] = [];
  idUser:any
  isPayment: boolean = false;
  public newFormGroupChiTiet: FormGroup;
  modelEdit:any={};


  async ngOnInit() {

    this.fetchNhaCungCaps();

    this.formGroup = new FormGroup({
      nhacungcap: new FormControl('', Validators.compose([Validators.required])),
    });
    
    this.newFormGroupChiTiet = new FormGroup({
      GiaNhapSanPhamBienThe: new FormControl(0,[]),
      TenSanPhamBienThe: new FormControl("",[Validators.required]),
      SoLuongNhap: new FormControl(50,[Validators.required,]),
      IdKho: new FormControl('', Validators.compose([Validators.required])),
      NgaySanXuat: new FormControl(''),
      NgayHetHan: new FormControl(''),
      IsPayment: new FormControl(),
    });

  }

  fetchNhaCungCaps() {
    this.service.getnhacungcaphttp().subscribe(
      response => {
        if (response.status) {
          this.nhacungcaps = response.data; 
          console.log("Danh sách nhà cung cấp:", this.nhacungcaps);
        } else {
          console.error("Lỗi khi lấy danh sách nhà cung cấp:", response.message);
        }
      },
      error => {
        console.error("Lỗi kết nối tới API:", error);
      }
    );
  }
  get TenSanPhamBienThe() { return this.newFormGroupChiTiet.get('TenSanPhamBienThe'); }

  get SoLuongNhap() { return this.newFormGroupChiTiet.get('SoLuongNhap'); }

  get GiaNhapSanPhamBienThe() { return this.newFormGroupChiTiet.get('GiaNhapSanPhamBienThe'); }

  GiaNhapSanPhamBienThes(value){
    this.newFormGroupChiTiet.get('GiaNhapSanPhamBienThe').setValue(value)
  }
  idncc:any
  getSanPhamNhaCungCap(event) {
    var obj = {
      // id: event.target.value
      id: event.value
    }
    this.idncc=obj.id
    console.log("object :", obj);
    this.service.gettensanphamhttp(obj).subscribe(res => {
      this.sanphams = res;
      console.log(this.sanphams);
    });
    this.service.getonenhacungcaphttp(obj).subscribe(res => {
      this.motnhacungcap = res;
      console.log("mot nha cung cap",this.motnhacungcap);
    });
  }
  selectedFruit = null;
  getSanPhamBienTheSanPham(event) {
    this.selectedFruit = 'Apple'
    console.log(this.selectedFruit);
    var obj = {
      //id: event.target.value
      id:event.value
    }
    this.service.gettensanphambienthehttp(obj).subscribe(res => {
      this.sanphambienthes = res;
      console.log("san pham bien the",this.sanphambienthes);
      this.GiaNhapSanPhamBienThes(this.sanphambienthes[0].giaNhap)
    });
  }
  
  onSubmitChiTiet = (data) => {
    
    console.log(data);
    
    const selectedKho = this.list_warehouse.find(kho => kho.id === data.IdKho);

    const chiTiet = {
      TenSanPhamBienThe: data.TenSanPhamBienThe.tenSanPhamBienTheMauSize,
      GiaNhapSanPhamBienThe: data.GiaNhapSanPhamBienThe,
      SoLuongNhap: data.SoLuongNhap,
      IdKho: data.IdKho,
      TenKho: selectedKho ? selectedKho.name : 'Không xác định',
      NgayHetHan: data.NgayHetHan ? new Date(data.NgayHetHan).toISOString().split('T')[0] : null,
      NgaySanXuat: data.NgaySanXuat ? new Date(data.NgaySanXuat).toISOString().split('T')[0] : null,
    };

    this.chitiets.push(chiTiet);
    console.log("Chi tiết phiếu nhập:", this.chitiets);
};

  tongTien(){
    let sum = 0
    for(var i=0;i< this.chitiets.length;i++){
      sum = sum + (this.chitiets[i].SoLuongNhap * this.chitiets[i].GiaNhapSanPhamBienThe)
    }
    return sum
  }
  public deleteDetail(item: any) {
    for (var index = 0; index < this.chitiets.length; index++) {
      let detail = this.chitiets[index];
      if ( detail.TenSanPhamBienThe == item.TenSanPhamBienThe
        && detail.SoLuongNhap == item.SoLuongNhap) {
        this.chitiets.splice(index, 1);
      }
    }
  }
  phieunhappost:any
  async showPopup(){
    this.isShow=true;
    this.modelEdit={};
    this.edit.GhiChu="";

  this.newFormGroupChiTiet.reset({
      TenSanPhamBienThe: '',
      GiaNhapSanPhamBienThe: 0,
      SoLuongNhap: 50,
  });
  this.nhacungcaps=[];
  console.log("ncc",this.nhacungcaps)
  this.chitiets = [];
  this.sanphams = [];
  this.sanphambienthes = [];
  this.motnhacungcap = null;
  this.idncc = null;
  this.fetchNhaCungCaps();
  await this.GetsWareHouse();
  }
  closeForm() {
    this.isShow = false;
    
  }
  onSubmit=(data) =>{
    this.idUser = localStorage.getItem("idUser")  
    this.service.phieunhappost.nguoiLapPhieu=this.idUser
    this.service.phieunhappost.ghiChu=data.GhiChu
    this.service.phieunhappost.tongTien=this.tongTien()
    this.service.phieunhappost.idNhaCungCap = this.idncc
    this.service.phieunhappost.ChiTietPhieuNhaps=this.chitiets
    console.log("this. service : ",this.service.phieunhappost);
    this.service.post(this.service.phieunhappost).subscribe(re=>{
      this.serviceToast.showToastThemThanhCong();
      console.log("dữ liệu trả ra",re);
      this.onSaved.emit(re);
    })
    this.isShow=false
  }
  edit: any = { GhiChu: '' };
  save(){

    if(this.chitiets.length==0){ 
      this.serviceToast.showToastCofigWarming("Vui lòng thêm sản phẩm vào phiếu nhập");
      return;
    }

    this.idUser=localStorage.getItem("idUser")
    const item={
      nguoiLapPhieu:this.idUser,
      ghiChu:this.edit.GhiChu,
      tongTien:this.tongTien(),
      idNhaCungCap:this.idncc,
      isPayment:this.isPayment,
      ChiTietPhieuNhaps:this.chitiets
    }
    console.log("don nhap : ",item);
    this.service.post(item).subscribe(re=>{
      this.serviceToast.showToastThemThanhCong();
      console.log("dữ liệu trả ra",re);
      this.onSaved.emit(re);
    })
    this.isShow=false
  }

  async GetsWareHouse() {
    await this.WareHouseService.Gets('', 0, 20, '').then(res => {
       if (res.status) {
         this.list_warehouse = res.data;
         console.log(this.list_warehouse);
         
       }
     }).catch(error => {
       this._notifierService.showHttpUnknowError();
     });
   }

   CheckPayment(event:any) {
    this.isPayment = event;
    console.log(event);
   }

}
