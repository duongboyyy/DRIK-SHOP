import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  uFormGroup:FormGroup
  constructor(private http: HttpClient, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.uFormGroup = this.formBuilder.group({
      User: ['', Validators.required],
      New: ['', Validators.required],
      ConfirmPass: ['', Validators.required],
    });
    console.log('first',localStorage)
  }
  
  Save(): void {
    if (this.uFormGroup.invalid) {
      Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin!', 'error');
      return;
    }

    
    const formData = this.uFormGroup.value;
    console.log('a',formData)
    if (formData.New !== formData.ConfirmPass) {
      Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    const clicks = localStorage.getItem('idUser');
    const resetPasswordData = {
      UserId: clicks,
      NewPassword: formData.New,
      ConfirmPassword: formData.ConfirmPass,
    };
  
    this.http.post(`${environment.URL_API}UserManagers/reset-password`, resetPasswordData).subscribe(
      (response: any) => {
        if(response.status){
          Swal.fire('Thành công', response.message || 'Cập nhật mật khẩu thành công!', 'success');
        }
          
      },
      (error) => {
        Swal.fire('Lỗi', 'Không thể kết nối đến server!', 'error');
      }
    );
  }
}
