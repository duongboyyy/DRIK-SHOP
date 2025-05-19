import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { HoaDon1Service } from '../hoadon1.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-hoa-don-edit-multiple',
  templateUrl: './hoa-don-edit-multiple.component.html',
  styleUrls: ['./hoa-don-edit-multiple.component.scss']
})
export class HoaDonEditMultipleComponent extends SecondPageEditBase  implements OnInit {
  [x: string]: any;
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  submitted = false;
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private service: HoaDon1Service
  ) {
    super(null,_injector);
  }
  modelEdit: any = {}; 
  formGroup: FormGroup;
  @Input() hoaDonId!: number;
  list: any[];
  trangThai!: number;
  trangThaiOptions = [
    {  label: 'Chờ xác nhận' ,value: 0},
    {  label: 'Đã xác nhận' ,value: 1},
    {  label: 'Hoàn thành',value: 2 },
    {  label: 'Đã hủy',value: 3 },
    {  label: 'Đang giao hàng',value: 4 },
    {  label: 'Chờ thanh toán',value: 5 }
  ];
  hd:any={};
  async showPopup(listitem) {
    this.isShow = true;
    this.list=listitem;
    // this.service.getDetailhoadon(id).then(re => {
    //         this.modelEdit = re as any;
    //         this.hoaDonId=id;
    //         this.hd = this.modelEdit.hoaDon;
    //         console.log('dêtail',this.modelEdit)  
    // });
    
    
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
  this.list.forEach(item => {
    const trangThai=this.hd.trangThai;
    
    const formData = new FormData();
    if(trangThai==null){
      formData.append('TrangThai', this.hd.toString())
    }else{
      formData.append('TrangThai', trangThai.toString())
      this.service.Save(item.id, formData).subscribe(
        re=>{
          if (re.status) {
            this.onSaved.emit(re.data);
          }
          else{
            this.serviceToast.showToastSuaThatBai();
          }
        }
      );
    }
  })
  this.serviceToast.showToastSuaThanhCong();
  //const trangThai = this.formGroup.get('trangThai')?.value.value; 
 
  this.isShow = false;
  

  
}
exportGeneratePdf(id:any) {
  window.open(`https://localhost:44302/api/GeneratePdf/orderdetail/${id}`, "_blank");
}
  
}