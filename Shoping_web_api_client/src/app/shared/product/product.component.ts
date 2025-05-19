import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
declare var $: any;
import Swal from 'sweetalert2'
import { CartService } from 'src/app/service/product.service';
import { Product } from 'src/app/model/product.model';
import { switchAll } from 'rxjs/operators';
import * as signalR from '@microsoft/signalr';
import { ProductService } from './product.service';
import { SharedService } from '../shared.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/service/account/user.service';
@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {
    public chose_gia;
    public chose_mau;
    public chose_loai;
    public list_product: Product[] = [];
    public list_product_male: Product[] = [];
    public list_product_female: Product[] = [];

    public products: Product[]=[];
    public mausac: any;
    searchText = ''; 
    responsiveOptions;
    

    filteredProducts: any[] = [];
    paginatedProducts = [];
    currentPage: number = 1;
    itemsPerPage: number = 8;
    totalPages: number[] = [];
    filter: number=-1;

    thap:string="";
    cao:string="";
    mau:string="";
    loai:string="";
    public statusData: boolean = false
    constructor(public http: HttpClient, public cart: CartService, public service: ProductService, public sharedservice: SharedService,private userService: UserService) {
        
    }
    ngOnInit() {
        //this.chose_gia = 1;
        
        this.http
            .get(environment.URL_API + 'mausacs/mausac/', {}
            ).subscribe(resp => {
                this.mausac = resp;
            });
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 3,
                numScroll: 3
            },
            {
                breakpoint: '768px',
                numVisible: 2,
                numScroll: 2
            },
            {
                breakpoint: '560px',
                numVisible: 1,
                numScroll: 1
            }
        ];
        //this.loadProducts();
        this.service.getlaytatcasanpham().subscribe(
            (resp: any) => {
              if (resp?.status) {
                this.list_product = resp.data;
                this.list_product_male = this.list_product.filter(d => d.gioiTinh == 1);
                this.list_product_female = this.list_product.filter(d => d.gioiTinh == 2);
                console.log("h",this.list_product);
                this.filterProducts(-1);
              } else {
                console.error('API không trả về mảng:', resp);
                this.list_product = [];
              }
              this.sharedservice.dataloadvariable = true;
              this.statusData = true;
            },
            (error) => {
              console.error('Lỗi khi gọi API:', error);
              this.list_product = []; // Xử lý lỗi
            }
          );
          
          
        this.service.getsanphammoi().subscribe(resp => {
            this.products = resp.data as Product[];
            console.log("product",this.products)
        });
        const connection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl('https://localhost:44302/notify')
            .build();
        connection.start().then(function () {
            console.log('SignalR Connected!');
        }).catch(function (err) {
            return console.error(err.toString());
        });
        connection.on("BroadcastMessage", () => {
            this.service.getlaytatcasanpham().subscribe(resp => {
                this.list_product = resp.data as Product[];
                this.list_product_male = this.list_product.filter(d => d.gioiTinh == 1);
                this.list_product_female = this.list_product.filter(d => d.gioiTinh == 2);
            });
            this.loadProducts();
        });
        connection.on("BroadcastMessage", () => {
            this.service.getsanphammoi().subscribe(resp => {
                this.products = resp as Product[];
                this.statusData = true;
            });
        });
        
        
    }
    

    loadProducts() {
        // Giả sử fetch từ API hoặc dữ liệu mẫu
        this.filterProducts(-1); // Lọc tất cả sản phẩm mặc định
    }

    filterProducts(filter: number) {
        this.filter = filter;
        if (filter === -1) {
            this.filteredProducts = [...this.list_product];
        } else {
            this.filteredProducts = this.list_product.filter(item => item.gioiTinh === filter);
        }
        this.currentPage = 1; // Reset về trang đầu tiên
        this.updatePagination();
    }
    trackByProductId(index: number, product: any) {
        return product.id;
    }
    updatePagination() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        this.paginatedProducts = this.filteredProducts.slice(start, end);

        const totalItems = this.filteredProducts.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        this.totalPages = Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    changePage(page: number) {
        if (page < 1 || page > this.totalPages.length) return;
        this.currentPage = page;
        this.updatePagination();
    }

    like(idSanPham) {
        if(this.userService.checkLogin()){
            const clicks = localStorage.getItem('idUser');
            this.http
                .post(environment.URL_API + 'sanphams/like/', {
                    IdSanPham: idSanPham,
                    IdUser: clicks,
                }
                ).subscribe(resp => {
                    if (resp == 1) {
                        this.list_product.filter(d => d.id == idSanPham)[0].like == 1;
                        Swal.fire("Sản phẩm được thêm vào danh sách yêu thích", '', 'success');
                    }
                    if (resp == 2) {
                        this.list_product.filter(d => d.id == idSanPham)[0].like == null;
                        Swal.fire("Sản phẩm được xoá khỏi danh sách yêu thích", '', 'success');
                    }
                });
            this.cart.addToLove(this.list_product.filter(d => d.id == idSanPham)[0]);
            console.log("like",this.list_product)
        }
    }
    list_sanphamyeuthich:any;
    checklike(idSanPham){
        const clicks = localStorage.getItem('idUser');
  this.http.post(environment.URL_API+"sanphams/dslike/",{
    IdUser:clicks,
    }).subscribe(
      (res:any)=>{
        if(res.status){
            this.list_sanphamyeuthich=res.data;
            console.log("like",this.list_sanphamyeuthich);
            const isLiked = this.list_sanphamyeuthich.some((sp: any) => sp.idSanPham === idSanPham);
            return isLiked ? 1 : null;
        }
        
      });
      
    }

    searchTheoGia(thap, cao, choser) {
        if(this.thap==thap &&  this.cao==cao) {
            this.chose_gia = null;
            this.thap='';
            this.cao='';
        }else{
            this.thap=thap;
            this.cao=cao;
            this.chose_gia = choser;
        }
        this.http
            .post(environment.URL_API + 'sanphams/loc', {
                thap: this.thap,
                cao: this.cao,
                loai:this.loai,
                mausac: this.mau
            }
            ).subscribe((resp:any) => {
                this.list_product = resp.data;
                // this.list_product_male = this.list_product.filter(d => d.gioiTinh == 1);
                // this.list_product_female = this.list_product.filter(d => d.gioiTinh == 2);
                
                this.filteredProducts=resp.data;
                    this.currentPage = 1; // Reset về trang đầu tiên
                    this.updatePagination();
               
            });
    }
    // searchTheoLoai(loai:number, choser) {
    //     this.service.searchTheoLoai(loai).subscribe((resp:any) => {
    //             if(resp.status){
    //                 this.list_product = resp.data;
    //                 console.log("vu",resp)
    //                 this.chose_loai = choser;
    //                 this.updatePagination();
    //             }
                
    //         });
    // }
    searchTheoLoai(loai:string, chose) {
        if(this.loai==loai) {
            this.chose_loai= null;
            this.loai='';
        } else {
            this.loai=loai;
            this.chose_loai= chose;
        }
        
        this.http
            .post(environment.URL_API + 'sanphams/loc', {
                thap: this.thap,
                cao: this.cao,
                loai:this.loai,
                mausac: this.mau
            }
            ).subscribe((resp:any) => {
                if(resp.status){
                    this.list_product = resp.data;
                    
                    //this.paginatedProducts=resp.data;
                    this.filteredProducts=resp.data;
                    this.currentPage = 1; // Reset về trang đầu tiên
                    this.updatePagination();
                }
                
            });
    }
    
    searchthemau(mausac, chose) {
        if(this.mau==mausac) {
            this.chose_mau = null;
            this.mau='';
        } else {
            this.mau=mausac;
            this.chose_mau = chose;
        }
        
        this.http
            .post(environment.URL_API + 'sanphams/loc', {
                thap: this.thap,
                cao: this.cao,
                loai:this.loai,
                mausac: this.mau
            }
            ).subscribe((resp:any) => {
                if(resp.status){
                    this.list_product = resp.data;
                    
                    this.filteredProducts=resp.data;
                    this.currentPage = 1; // Reset về trang đầu tiên
                    this.updatePagination();
                }
                
            });
    }

    onSearchChange() {
        // Khi giá trị tìm kiếm thay đổi
        if (this.searchText.trim() === '') {
          this.filteredProducts = [...this.list_product];  // Hiển thị tất cả nếu không có gì tìm kiếm
        } else {
          this.filteredProducts = this.list_product.filter(product =>
            product.ten.toLowerCase().includes(this.searchText.toLowerCase())
          );  // Lọc sản phẩm theo tên
        }
        this.currentPage = 1;  // Reset lại trang khi tìm kiếm thay đổi
        this.updatePagination();
      }

    check(idSanPham): number {
        var kq;
        const clicks = localStorage.getItem('idUser');
        this.http
            .post(environment.URL_API + 'sanphams/checklike/', {
                IdSanPham: idSanPham,
                IdUser: clicks,
            }
            ).subscribe(resp => {
                kq = resp;
            });
        return kq;
    }
    ngAfterViewInit(): void {
        $('.js-show-filter').on('click', function () {
            $(this).toggleClass('show-filter');
            $('.panel-filter').slideToggle(400);
            if ($('.js-show-search').hasClass('show-search')) {
                $('.js-show-search').removeClass('show-search');
                $('.panel-search').slideUp(400);
            }
        });
        $('.js-show-search').on('click', function () {
            $(this).toggleClass('show-search');
            $('.panel-search').slideToggle(400);
            if ($('.js-show-filter').hasClass('show-filter')) {
                $('.js-show-filter').removeClass('show-filter');
                $('.panel-filter').slideUp(400);
            }
        });
        var $topeContainer = $('.isotope-grid');
        var $filter = $('.filter-tope-group');
        // filter items on button click
        $filter.each(function () {
            $filter.on('click', 'button', function () {
                var filterValue = $(this).attr('filter');
                $topeContainer.isotope({ filter: filterValue });
            });
        });
        // init Isotope
        $(window).on('load', function () {
            var $grid = $topeContainer.each(function () {
                $(this).isotope({
                    itemSelector: '.isotope-item',
                    layoutMode: 'fitRows',
                    percentPosition: true,
                    animationEngine: 'best-available',
                    masonry: {
                        columnWidth: '.isotope-item'
                    }
                });
            });
        });
        var isotopeButton = $('.filter-tope-group button');
        $(isotopeButton).each(function () {
            $(this).on('click', function () {
                for (var i = 0; i < isotopeButton.length; i++) {
                    $(isotopeButton[i]).removeClass('how-active1');
                }
                $(this).addClass('how-active1');
            });
        });
        $('.js-show-modal1').on('click', function (e) {
            e.preventDefault();
            $('.js-modal1').addClass('show-modal1');
        });
        $('.js-hide-modal1').on('click', function () {
            $('.js-modal1').removeClass('show-modal1');
        });
        $('.wrap-slick1').each(function () {
            var wrapSlick1 = $(this);
            var slick1 = $(this).find('.slick1');
            var itemSlick1 = $(slick1).find('.item-slick1');
            var layerSlick1 = $(slick1).find('.layer-slick1');
            var actionSlick1 = [];
            $(slick1).on('init', function () {
                var layerCurrentItem = $(itemSlick1[0]).find('.layer-slick1');
                for (var i = 0; i < actionSlick1.length; i++) {
                    clearTimeout(actionSlick1[i]);
                }
                $(layerSlick1).each(function () {
                    $(this).removeClass($(this).data('appear') + ' visible-true');
                });
                for (var i = 0; i < layerCurrentItem.length; i++) {
                    actionSlick1[i] = setTimeout(function (index) {
                        $(layerCurrentItem[index]).addClass($(layerCurrentItem[index]).data('appear') + ' visible-true');
                    }, $(layerCurrentItem[i]).data('delay'), i);
                }
            });
            var showDot = false;
            if ($(wrapSlick1).find('.wrap-slick1-dots').length > 0) {
                showDot = true;
            }
            $(slick1).slick({
                pauseOnFocus: false,
                pauseOnHover: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
                speed: 1000,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 6000,
                arrows: true,
                appendArrows: $(wrapSlick1),
                prevArrow: '<button class="arrow-slick1 prev-slick1"><i class="zmdi zmdi-caret-left"></i></button>',
                nextArrow: '<button class="arrow-slick1 next-slick1"><i class="zmdi zmdi-caret-right"></i></button>',
                dots: showDot,
                appendDots: $(wrapSlick1).find('.wrap-slick1-dots'),
                dotsClass: 'slick1-dots',
                customPaging: function (slick, index) {
                    var linkThumb = $(slick.$slides[index]).data('thumb');
                    var caption = $(slick.$slides[index]).data('caption');
                    return '<img src="' + linkThumb + '">' +
                        '<span class="caption-dots-slick1">' + caption + '</span>';
                },
            });
            $(slick1).on('afterChange', function (event, slick, currentSlide) {
                var layerCurrentItem = $(itemSlick1[currentSlide]).find('.layer-slick1');
                for (var i = 0; i < actionSlick1.length; i++) {
                    clearTimeout(actionSlick1[i]);
                }
                $(layerSlick1).each(function () {
                    $(this).removeClass($(this).data('appear') + ' visible-true');
                });
                for (var i = 0; i < layerCurrentItem.length; i++) {
                    actionSlick1[i] = setTimeout(function (index) {
                        $(layerCurrentItem[index]).addClass($(layerCurrentItem[index]).data('appear') + ' visible-true');
                    }, $(layerCurrentItem[i]).data('delay'), i);
                }
            });
        });
    }
}
