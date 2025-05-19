import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  userFormGroup: FormGroup;
  codeFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  isMail=true;
  isCodeSent = false;
  isCodeCorrect = false;
  generatedCode: string;
  email: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.codeFormGroup = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });

    this.passwordFormGroup = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get emailControl() {
    return this.userFormGroup.get('email');
  }

  get code() {
    return this.codeFormGroup.get('code');
  }

  get password() {
    return this.passwordFormGroup.get('password');
  }
  get confirmPassword() {
    return this.passwordFormGroup.get('confirmPassword');
  }

  // Gửi mã qua email
  onSubmitEmail() {
    if (this.userFormGroup.valid) {
      this.email = this.emailControl.value;
      this.generatedCode = Math.floor(1000 + Math.random() * 9000).toString();

      const emailData = new FormData();
      emailData.append('To', this.email);
      emailData.append('Ma', this.generatedCode);

      // this.http.post(`${environment.URL_API}Email`, emailData).subscribe(
      //   (response) => {
      //     this.isCodeSent = true;
      //     Swal.fire('Mã xác nhận đã được gửi qua email của bạn!', '', 'success');
      //     console.log(response)
      //     this.isMail=false
      //   },
        
      // );
      this.http.post(`${environment.URL_API}Email`, emailData).subscribe({
        next: (response) => {
          // Khi gửi email thành công
          this.isCodeSent = true;
          Swal.fire('Mã xác nhận đã được gửi qua email của bạn!', '', 'success');
          console.log(response);
          this.isMail = false;
        },
        error: (error) => {
          // Xử lý lỗi khi gửi email
          if (error.status === 409) {
            Swal.fire('Lỗi', 'Email chưa có tài khoản', 'error');
          } else {
            // Lỗi khác
            Swal.fire('Đã xảy ra lỗi', 'Không thể gửi email. Vui lòng thử lại sau.', 'error');
          }
          console.error(error);
        }
      });
      
    }
  }

  // Kiểm tra mã xác nhận
  onSubmitCode() {
    if (this.codeFormGroup.valid) {
      const enteredCode = this.code.value;

      if (enteredCode === this.generatedCode) {
        this.isCodeCorrect = true;
        Swal.fire('Mã xác nhận đúng. Bạn có thể thay đổi mật khẩu.', '', 'success');
        this.isCodeSent = false;
      } else {
        Swal.fire('Mã xác nhận không đúng. Vui lòng thử lại.', '', 'error');
      }
    }
  }

  // Cập nhật mật khẩu
  onSubmitPassword() {
    if (this.passwordFormGroup.valid) {
      const newPassword = this.password.value;
      const confirmPassword=this.confirmPassword.value;
      if(newPassword!=confirmPassword){
        Swal.fire('Mật khẩu không khớp');
      }
      else{
      const resetPasswordData = {
            UserName: this.email,
            NewPass: newPassword,
            ConfirmPass:confirmPassword,
          };
        
          this.http.post(`${environment.URL_API}Auth/reset-password`, resetPasswordData).subscribe(
            (response: any) => {
              if(response.status){
                Swal.fire( 'Cập nhật mật khẩu thành công!');
                this.router.navigate(['/login']);
              }
                
            },
            (error) => {
              Swal.fire('Lỗi', 'Không thể kết nối đến server!', 'error');
            }
          );
        }
      }
  }
}
