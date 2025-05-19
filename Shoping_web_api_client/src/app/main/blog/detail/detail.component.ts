import { Component, OnInit ,AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit ,AfterViewInit{
  public id_blog: string;
  public blog:any;
  constructor(public http:HttpClient,public route: ActivatedRoute,private sanitized: DomSanitizer) { 
    
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_blog = params['id']; // get id to params
  });
  this.http.get(environment.URL_API+"blogs/"+this.id_blog
  ).subscribe((res:any) => {
    if(res.status){
      this.blog=res.data;
      console.log("h",this.blog)
    }
      
      
  });
    console.log("id",this.id_blog)
  }
  isExpanded = false;
  showReadMore = false;
  @ViewChild('contentWrapper') contentWrapper!: ElementRef;
  ngAfterViewInit() {
    // Kiểm tra chiều cao của nội dung sau khi view được render
    if (this.contentWrapper && this.contentWrapper.nativeElement) {
      if (this.contentWrapper.nativeElement.scrollHeight > this.contentWrapper.nativeElement.clientHeight) {
        this.showReadMore = true;
      }
    } else {
      console.log('contentWrapper không được khởi tạo hoặc không tồn tại trong view.');
    }
    $('.wrap-slick3').each(function(){
      $(this).find('.slick3').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          infinite: true,
          autoplay: false,
          autoplaySpeed: 6000,
          arrows: true,
          appendArrows: $(this).find('.wrap-slick3-arrows'),
          prevArrow:'<button class="arrow-slick3 prev-slick3"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
          nextArrow:'<button class="arrow-slick3 next-slick3"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
          // dots: true,
          // appendDots: $(this).find('.wrap-slick3-dots'),
          // dotsClass:'slick3-dots',
          // customPaging: function(slick, index) {
          //     var portrait = $(slick.$slides[index]).data('thumb');
          //     return '<img src=" ' + portrait + ' "/><div class="slick3-dot-overlay"></div>';
          // },
      });
  });
  }

  toggleContent() {
    this.isExpanded = !this.isExpanded;
    // Cập nhật chiều cao của phần nội dung khi toggle
    if (this.isExpanded) {
      this.contentWrapper.nativeElement.style.maxHeight = 'none';
    } else {
      this.contentWrapper.nativeElement.style.maxHeight = '150px';
    }
  }
}
