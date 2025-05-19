import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/service/account/user.service';
@Component({
  selector: 'app-contact',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss']
})
export class LikeComponent implements OnInit {
  list_sanphamyeuthich:any;
  constructor(public http:HttpClient,public route: ActivatedRoute,private cartService: CartService,private userService: UserService) {
   }
  ngOnInit(): void {
    this.userService.checkLogin();
    const clicks = localStorage.getItem('idUser');
  this.http.post(environment.URL_API+"sanphams/dslike/",{
    IdUser:clicks,
    }).subscribe(
      (res:any)=>{
        if(res.status){
          this.list_sanphamyeuthich=res.data;
          console.log("like",this.list_sanphamyeuthich)
        }
        
      });
  }
  deleteSanPham(product){
    this.http.post(environment.URL_API+"sanphams/deletelike/"+product.id,{
  }).subscribe(
    res=>{
      Swal.fire("Xoá sản phẩm thành công .", '', 'success');
      const clicks = localStorage.getItem('idUser');
      this.http.post(environment.URL_API+"sanphams/dslike/",{
        IdUser:clicks,
        }).subscribe(
          (res:any)=>{
            this.list_sanphamyeuthich=res.data;
          });
          this.cartService.DeleteProductInLove(product);
    })
  }
}
