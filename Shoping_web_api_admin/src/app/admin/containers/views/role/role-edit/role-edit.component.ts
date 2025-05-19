import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core'; 
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../role.service';
@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent extends SecondPageEditBase implements OnInit{
  formGroup: FormGroup;
  submitted = false;
  modelEdit: any = {};
  claims:{ id: number; type: string; value: string; }[] = []; 
  deleteClaims: { id: number; type: string; value: string; }[] = [];

  isAddClaimVisible: boolean = false; // Thêm biến để điều khiển việc hiển thị form nhập claim mới
  newClaim: { type: string; value: string; } = { type: '', value: '' };
  claimnew:{id:number;type:string;value:string}={id:0,type:'',value:''};
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private serviceD: RoleService
  ) {
    super(null,_injector);
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required])),
      normalizedName:new FormControl(""),
      concurrencyStamp:new FormControl(""),
      type:new FormControl(""),
      value:new FormControl(""),
    });
   
  }
  closeForm() {
    this.isShow = false;
    this.claims = []; // Đặt lại claims nếu cần
    this.formGroup.reset();
    this.isAddClaimVisible = false;
    this.deleteClaims = [];
  }
  async showPopup(id: any) {
    this.isShow = true; 
    if (id) {
        this.serviceD.getDetail(id).then(re => {
            if (re.status) {
                this.modelEdit = re.data;
                this.formGroup.patchValue({
                  name: this.modelEdit.name,
                });
            }
        });
        this.loadRoleClaims(id);
    } else {
        this.modelEdit = {};
        this.modelEdit.id = 0; 
        this.formGroup.reset();
        this.claims = []; 
    }
}
async loadRoleClaims(roleId: string) {
  try {
    const response = await this.serviceD.getRoleClaims(roleId);
    if (response.status) {
      this.claims = response.data; // Gán dữ liệu claims nhận được từ API
    } else {
      this.claims = []; // Nếu không có claim, gán mảng rỗng
    }
  } catch (error) {
    console.error("Lỗi khi lấy claim:", error);
    this.claims = []; // Gán mảng rỗng khi có lỗi
  }
}



async saveClaims(roleId: string) {
  try {
    // Tạo danh sách các promise để thêm claims
    // const addClaimPromises = this.claims.map(claim => {
    //   const claimDto = { type: claim.type, value: claim.value };
    //   return this.serviceD.AddRoleClaim(roleId, claimDto).toPromise();
    // });
    for(const claim of this.claims){
      const claimDto = { type: claim.type, value: claim.value };
      await this.serviceD.AddRoleClaim(roleId, claimDto).toPromise();
    }

    // Tiếp tục với việc xóa các claims trong mảng deleteClaims
    for (const claim of this.deleteClaims) {
      await this.serviceD.removeRoleClaim(roleId, claim.id).toPromise();
    }

  } catch (error) {
    console.error("Error saving claims:", error);
    //sthis.serviceToast.showToastXoaThatBai();
  }
}


onDeleteClaim(id: number) {
  if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
    const claimToDelete = this.claims.find(claim => claim.id === id);
    if (claimToDelete) {
      this.deleteClaims.push(claimToDelete); // Thêm claim vào mảng delete
      this.claims = this.claims.filter(claim => claim.id !== id); // Xóa claim khỏi mảng claims
      //this.serviceToast.showToastXoaThanhCong();
    } 
  }
}

showAddClaimForm() {
  this.isAddClaimVisible = true; // Hiển thị form nhập claim mới
  this.newClaim = { type: '', value: '' }; // Đặt lại thông tin claim mới
}

addClaim() {
  if (this.newClaim.type && this.newClaim.value) {
    const claimnew = { id: this.generateUniqueId(), ...this.newClaim }; // Tạo claim mới với ID tạm thời
    this.claims.push(claimnew); // Thêm claim vào mảng claims
    this.claimnew={ id:0,type: '', value: '' };
    this.isAddClaimVisible = false; // Ẩn form nhập claim mới
  } 
}
save() {
  this.submitted = true;
  if (this.formGroup.valid) {
    const item = {
      id: this.modelEdit.id || '',
      name: this.formGroup.get('name')?.value,
      normalizedName: "",
      concurrencyStamp: "",
    };

    this.serviceD.Save(item).subscribe(re => {
      if (re.status) {
        // Sau khi lưu role, lấy ID của nó để lưu claim
        const roleId = re.data.id;
        this.saveClaims(roleId); // Gọi hàm lưu claims
        if(this.modelEdit.id){
          this.serviceToast.showToastSuaThanhCong();
        }
        else this.serviceToast.showToastThemThanhCong();
        this.onSaved.emit(re.data);
        this.isShow = false;
      } else {
        this.serviceToast.showToastSuaThatBai();
        this.isShow = true;
      }
    });
  }
}

generateUniqueId() {
  return Math.floor(Math.random() * Date.now());
}


// save() {
//   this.submitted = true;
//   if (this.formGroup.valid) {
//       const formData = new FormData();
//       const item = {
//           id: this.modelEdit.id||'',
//           name: this.formGroup.get('name')?.value,
//           normalizedName:"",
//           concurrencyStamp:"",
//       };

//       for (const key in item) {
//           formData.append(key, item[key]);
//       }
 
//       this.serviceD.Save(item).subscribe(re => {
//           if (re.status) {
//             if(this.modelEdit.id) {
//               this.serviceToast.showToastSuaThanhCong();
//             }
//             else {
//               this.serviceToast.showToastThemThanhCong();
//               var roleId = re.data.id;
//               //this.saveClaim(roleId);
//               //this.serviceD.AddRoleClaim(roleId, claimDto)
//             }
//             this.onSaved.emit(re.data);
//             this.isShow = false;
//           }
//           else {
//             this.serviceToast.showToastSuaThatBai();
//             this.isShow = true;
//           }
//       });
//   }
// }
// onDeleteClaim(id: number) {
//   if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
//     const roleId = this.modelEdit.id;
//     this.serviceD.removeRoleClaim(roleId, id).subscribe(
//       res => {
//         if (res.status) {
//           const data = this.claims.filter(claim => claim.id !== id);
//           this.claims = data;
//           this.serviceToast.showToastXoaThanhCong();
//         } else {
//           this.serviceToast.showToastXoaThatBai();
//         }
//       },
//       err => {
//         this.serviceToast.showToastXoaThatBai();
//       }
//     );
//   }
// }
// showAddClaimForm() {
//   this.isAddClaimVisible = true; // Hiển thị form nhập claim mới
//   this.newClaim = { type: '', value: '' }; // Đặt lại thông tin claim mới
// }
// async saveClaim() {
//   if (this.newClaim.type && this.newClaim.value) {
//       const roleId = this.modelEdit.id; // Lấy ID của vai trò
//       const claimDto = {
//           type: this.newClaim.type,
//           value: this.newClaim.value
//       };

//       this.serviceD.AddRoleClaim(roleId, claimDto).subscribe(
//           re => {
//               if (re.status) {
//                   this.claims.push({ ...claimDto, id: new Date().getTime() }); // Thêm claim mới vào danh sách claims
//                   this.serviceToast.showToastThemThanhCong();
//                   this.isAddClaimVisible = false; // Ẩn form nhập claim mới
//               } else {
//                   this.serviceToast.showToastXoaThatBai();
//               }
//           },
//           err => {
//               this.serviceToast.showToastXoaThatBai();
//           }
//       );
//   } else {
//       // Hiển thị thông báo nếu thông tin không hợp lệ
//       this.serviceToast.showToastXoaThatBai();
//   }
// }





// saveClaims(roleId: string) {
//   // Lưu các claim vào cơ sở dữ liệu
//   this.claims.forEach(claim => {
//     const claimDto = {
//                 type: claim.type,
//                 value: claim.value
//             };
//     this.serviceD.AddRoleClaim(roleId, claimDto).subscribe(
//       re => {
//         if (re.status) {
//           // Claim đã được thêm thành công
//           if(this.modelEdit.id){

//           }

//         } 
//       },
//     );
//   });

//   // Xóa các claim trong mảng delete
//   this.deleteClaims.forEach(claim => {
//     this.serviceD.removeRoleClaim(roleId, claim.id).subscribe(
//       res => {
//         if (res.status) {
//           //this.serviceToast.showToastXoaThanhCong();
//         } else {
//           //this.serviceToast.showToastXoaThatBai();
//         }
//       },
//       err => {
//         this.serviceToast.showToastXoaThatBai();
//       }
//     );
//   });
// }
}