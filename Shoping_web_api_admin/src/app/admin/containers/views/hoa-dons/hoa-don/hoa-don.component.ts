import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { CTHDViewModel, HoaDonService } from '../hoadon.service';
@Component({
  selector: 'app-hoa-don',
  templateUrl: './hoa-don.component.html',
  styleUrls: ['./hoa-don.component.scss']
})
export class HoaDonComponent implements OnInit {
  constructor( private service :HoaDonService){
  }
  url:any
  hd:any
  ngOnInit(): void {
    this.url = environment.URL_API
    this.getMotHoaDon(this.service.hoadon.id)
  }
  exportGeneratePdf() {
    window.open("https://localhost:44302/api/GeneratePdf/orderdetail/"+this.hd.id, "_blank");
  }
  getMotHoaDon(id:any){
    this.service.getMotHoaDonService(id).subscribe(
      res => {
        this.hd = res as any;
        console.log("chi tiet hoa don la: ",this.hd);
      }
    )
  }

}
