import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-banner-middle',
  templateUrl: './banner-middle.component.html',
  styleUrls: ['./banner-middle.component.scss']
})
export class BannerMiddleComponent implements OnInit,AfterViewInit {

  public list_banner_top:any[]=[];
  public list_banner_bottom:any[]=[];
  public currentSlide: number = 0;
  constructor(public http:HttpClient) { 
    
    
  }
  countdownDisplay: string = '';
  countdownInterval: any;
  ngOnInit(): void {
    this.http.get(environment.URL_API+"Banners/get?type=2",{}).subscribe(
      (res:any)=>{
        this.list_banner_top=res.data;
        console.log("banner",this.list_banner_top);
        this.startCountdown();
    });
  }
  getImage(path: string) {
    return `https://localhost:44302/Images/list-image-banner/${path}`;
}

currentIndex = 0; // Slide hiện tại

  // prevSlide() {
  //   this.currentIndex =
  //     (this.currentIndex - 1 + this.list_banner_top.length) % this.list_banner_top.length;
  //   this.updateSlide();
  // }

  // nextSlide() {
  //   this.currentIndex = (this.currentIndex + 1) % this.list_banner_top.length;
  //   this.updateSlide();
  // }
  prevSlide() {
    if (!this.list_banner_top || this.list_banner_top.length === 0) return;
  
    this.currentIndex =
      (this.currentIndex - 1 + this.list_banner_top.length) % this.list_banner_top.length;
    this.updateSlide();
  }
  
  nextSlide() {
    if (!this.list_banner_top || this.list_banner_top.length === 0) return;
  
    this.currentIndex = (this.currentIndex + 1) % this.list_banner_top.length;
    this.updateSlide();
  }

  updateSlide() {
    const slider = document.querySelector('.slider2') as HTMLElement;
    if (!slider) {
      // console.error('Không tìm thấy phần tử slider');
      return; 
    }
    const slideWidth = slider.clientWidth;
    slider.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;
  }

  // ngAfterViewInit() {
  //   setInterval(() => this.nextSlide(), 5000); // Chuyển slide 
  // }
  ngAfterViewInit() {
    // Chờ dữ liệu list_banner_top được load
    if (this.list_banner_top && this.list_banner_top.length > 0) {
      setInterval(() => this.nextSlide(), 5000); // Chuyển slide mỗi 5 giây
    } else {
      // console.warn('');
      const checkDataLoaded = setInterval(() => {
        if (this.list_banner_top && this.list_banner_top.length > 0) {
          clearInterval(checkDataLoaded); // Dừng kiểm tra khi đã có dữ liệu
          console.log('Dữ liệu banner đã load, khởi động slide.');
          setInterval(() => this.nextSlide(), 10000);
        }
      }, 500); // Kiểm tra dữ liệu mỗi 0.5 giây
    }
  }
  
  countdownIntervals: any[] = [];
  ngOnDestroy() {
    this.countdownIntervals.forEach(interval => clearInterval(interval));
  }

  startCountdown() {
    this.list_banner_top.forEach((banner, index) => {
      const targetTime = new Date(banner.endDate).getTime();  // Lấy thời gian kết thúc từ banner
      const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
          clearInterval(countdownInterval);
          this.list_banner_top[index].countdownDisplay = "EXPIRED";
          return;
        }

        // Tính toán số ngày, giờ, phút và giây
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Cập nhật countdown cho banner
        this.list_banner_top[index].countdownDisplay = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }, 1000);

      // Lưu các interval để dừng chúng khi component bị hủy
      this.countdownIntervals.push(countdownInterval);
    });
  }
}
