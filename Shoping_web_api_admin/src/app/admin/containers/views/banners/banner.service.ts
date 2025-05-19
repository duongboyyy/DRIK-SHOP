import { Blog } from './../blogs/blog.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BannerService {
  @ViewChild(MatSort) sort: MatSort;  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<Banner>();
    banner:Banner = new Banner()
    constructor(public http:HttpClient) { }
    delete(id:number){
      return this.http.delete(`${environment.URL_API+"banner"}/${id}`)
    }
    get():Observable<any>{
      return this.http.get<any>(environment.URL_API+"banner")
    }
    post(banner: any): Observable<any> {
      return this.http.post<any>(environment.URL_API + 'banner', banner)
    }
    getAllBanners(){
      this.get().subscribe(
        res=>{
          this.dataSource.data = res as Banner[];
        }
      )
    }
  }

export class Banner{
  id:number = 0
  name:string
  image:string
  description:string
  bannerType:string
}
