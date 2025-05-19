import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit {
  list_banner_top = [
  ];
  @ViewChildren('slickItem') slickItems!: QueryList<ElementRef>;
  public list_banner_bottom:any[]=[];
  public currentSlide: number = 0;
  constructor(public http:HttpClient,private renderer: Renderer2) {
    
   }
   currentYear: number = new Date().getFullYear();
   ngOnInit(): void {
    // this.http.get(environment.URL_API+"Banners/get?type=1",{}).subscribe(
    //   (res:any)=>{
    //     this.list_banner_top.push(...res.data);
    //     console.log("banner",this.list_banner_top);
    //     //this.startCountdown();
    // });
   }
   ngAfterViewInit() {
    this.loadBanners();
  }
   getImage(path: string) {
    return `https://localhost:44302/Images/list-image-banner/${path}`;
}
loadBanners() {
  this.http.get(environment.URL_API + 'Banners/get?type=1').subscribe((res: any) => {
    this.list_banner_top = res.data;

    // Delay để Angular hoàn tất render
    setTimeout(() => {
      //this.destroySlick();
      this.initSlick();
      
    }, 100);
  });
}
ngOnChanges() {
  // Hoặc khi list có dữ liệu, delay chút rồi init
  if (this.list_banner_top.length > 0) {
    setTimeout(() => {
      this.initSlick(); // gọi hàm init slick ở đây
    }, 100); // delay để DOM kịp render
  }
}
initSlick() {
  ($('.slick1') as any).slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 4000,
  });
}
destroySlick() {
  const $slick = $('.slick1');
  if ($slick.hasClass('slick-initialized')) {
    $slick.slick('unslick');
  }
}

}
