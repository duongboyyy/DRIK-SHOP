import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  public listblog:any[]=[];
  constructor(public http:HttpClient) {
    
  }
  ngOnInit(): void {
    this.http.get(environment.URL_API+"blogs",{}).subscribe(
      (res:any)=>{
        this.listblog=res.data;
        console.log(this.listblog);
    })
  }
  getImage(path: string) {
    return `https://localhost:44302/Images/list-image-blog/${path}`;
}
}
