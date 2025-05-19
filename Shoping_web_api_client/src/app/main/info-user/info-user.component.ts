import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DvhcService } from 'src/app/service/dvhc.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.scss'],
})
export class InfoUserComponent implements OnInit {
  user: any = {}; // Lưu thông tin người dùng
  userFormGroup: FormGroup; // Form điều khiển
  list_tinh_thanh: any;
  list_quan_huyen: any;
  list_xa_phuong: any;
  Tinh: string;
  Xa: string;
  Huyen: string;


  constructor(private http: HttpClient, private formBuilder: FormBuilder,  private dvhcService: DvhcService,) {}

  async ngOnInit() {
    // Khởi tạo form
    this.userFormGroup = this.formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      SDT: ['', Validators.required],
      DiaChi: ['', Validators.required],
      Tinh: ['', Validators.required],
      Huyen: ['', Validators.required],
      Xa: ['', Validators.required],
    });
  
    // Gọi API lấy thông tin người dùng
    const iduser = localStorage.getItem('idUser');
    this.http.get(environment.URL_API + `Auth/AuthHistory/${iduser}`).subscribe(
      async (res) => {
        this.user = res; // Gán dữ liệu vào user
        this.getFullName();
        this.initializeForm();
  
        // Đảm bảo danh sách tỉnh/thành phố được tải xong trước khi tiếp tục
        await this.getTinhThanh();
  
        // Nếu người dùng có thông tin tỉnh, tải quận/huyện và phường/xã tương ứng
        if (this.user.tinh) {
          this.Tinh = this.user.tinh;
          await this.changTinhThanh(this.user.tinh);
  
          // Đợi danh sách quận/huyện được tải xong
          if (this.user.huyen) {
            this.Huyen = this.user.huyen;
            await this.changHuyenQuan(this.user.huyen);
  
            // Đợi danh sách phường/xã được tải xong
            if (this.user.xa) {
              this.Xa = this.user.xa;
            }
          }
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  // Tạo fullName từ họ và tên
  getFullName(): void {
    this.user.fullName = this.user.firstName + ' ' + this.user.lastName;
  }

  // Khởi tạo FormGroup với dữ liệu từ user
  initializeForm(): void {
    // Cập nhật giá trị của form sau khi nhận dữ liệu từ API
    this.userFormGroup.patchValue({
      FirstName: this.user.firstName,
      LastName: this.user.lastName,
      SDT: this.user.sdt,
      DiaChi: this.user.diaChi,
      Tinh: this.user.tinh,  // Thêm trường Tỉnh
      Huyen: this.user.huyen, // Thêm trường Huyện
      Xa: this.user.xa        // Thêm trường Xã
    });
  }

  // Hàm lưu thông tin người dùng
  Save(): void {
    const iduser = localStorage.getItem('idUser');
    // Chuẩn bị dữ liệu gửi đi
    const updateData = {
      idUser: iduser,
      firstName: this.userFormGroup.value.FirstName,
      lastName: this.userFormGroup.value.LastName,
      sdt: this.userFormGroup.value.SDT,
      diaChi: this.userFormGroup.value.DiaChi,
      tinh: this.userFormGroup.value.Tinh,   // Thêm Tỉnh
      huyen: this.userFormGroup.value.Huyen, // Thêm Huyện
      xa: this.userFormGroup.value.Xa        // Thêm Xã
    };

    console.log('')
    // Gửi dữ liệu cập nhật qua API
    this.http.post(environment.URL_API + 'Auth/AuthHistory', updateData).subscribe({
      next: (resp) => {
        Swal.fire('Cập nhật thành công', '', 'success').then(() => {
          this.user = { ...this.user, ...updateData }; 
          console.log("user",this.user)
          this.getFullName();// Cập nhật dữ liệu hiển thị
        });
      },
      error: (err) => {
        Swal.fire('Lỗi cập nhật', err.message, 'error');
      },
    });
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


}
