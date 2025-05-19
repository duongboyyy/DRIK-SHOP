import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ToastServiceService } from '../../shared/toast-service.service';
import { ProfileService } from './profile.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent  implements OnInit {
  constructor(private fb: FormBuilder, public toast: ToastServiceService, 
    public service : ProfileService, public http: HttpClient,private router: Router) {
    this.newFormGroup = this.fb.group({
      SDT: [''],
      DiaChi: [''],
      FirstName: [''],
      LastName: [''],
      UserName: ['']
    });
   }
  id: string
  userApp: any
  user: any = {};
  public newFormGroup: FormGroup;
  ngOnInit(): void {
    this.id = localStorage.getItem('idUser');
    if (this.id) {
      this.http.get(`${environment.URL_API}Accounts/profile/${this.id}`).subscribe(
        (res: any) => {
          this.user = res; // Gán dữ liệu vào user
          this.initializeForm();// Cập nhật form với dữ liệu user
          console.log('user',this.user)
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } else {
      console.error('No user ID found in localStorage');
    }
  }
  initializeForm(): void {
    // Cập nhật giá trị của form sau khi nhận dữ liệu từ API
    this.newFormGroup.patchValue({
      FirstName: this.user.firstName,
      LastName: this.user.lastName,
      SDT: this.user.sdt,
      DiaChi: this.user.diaChi,
    });
  }
  fullname:any;
  onSubmit = (data) =>{
    const updateData = new FormData();
    updateData.append('FirstName', this.newFormGroup.value.FirstName);
    updateData.append('LastName', this.newFormGroup.value.LastName);
    updateData.append('SDT', this.newFormGroup.value.SDT);
    updateData.append('DiaChi', this.newFormGroup.value.DiaChi);
    console.log('gui',updateData)
    this.http.post(`${environment.URL_API}Accounts/updateprofile/${this.id}`, updateData).subscribe(
      (response) => {
        this.toast.showToastSuaThanhCong(); // Hiển thị thông báo thành công
        console.log('Profile updated successfully:', response);
        this.fullname=this.newFormGroup.value.FirstName+" "+this.newFormGroup.value.LastName;
        localStorage.setItem('fullname', this.fullname);
      },
      (error) => {
        console.error('Error updating profile:', error);
        this.toast.showToastSuaThatBai(); // Hiển thị thông báo thất bại
      }
    );
  }
  // Save(): void {
  //   // Chuẩn bị dữ liệu gửi đi
  //   const updateData = {
  //       firstName: this.newFormGroup.value.FirstName,
  //       lastName: this.newFormGroup.value.LastName,
  //       sdt: this.newFormGroup.value.SDT,
  //       diaChi: this.newFormGroup.value.DiaChi,
  //   };

  //   this.http.put(`${environment.URL_API}Accounts/profile/${this.id}`, updateData).subscribe({
  //     next: (resp) => {
  //     },
  //   });
  // }
}
