import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserIdenity} from '../../model/user.model'
import { CartService } from 'src/app/service/product.service';
import { environment } from 'src/environments/environment';
import { AuthLoginService } from 'src/app/service/account/auth-login.service';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit  {

     user:any;

  constructor(public http:HttpClient,private cartService: CartService, private authService: AuthLoginService){}
  
  items$ = this.cartService.items$;
  items1$ = this.cartService.items1$;

  ngOnInit() {
    
    this.authService.authNavStatus$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.authService.loadUserData().subscribe(
          res => this.user = res,
          error => console.error('Failed to fetch user data:', error)
        );
      }
    });
    


    $('.js-show-modal-search').on('click', function(){
      $('.modal-search-header').addClass('show-modal-search');
      $(this).css('opacity','0');
    });
  $('.js-hide-modal-search').on('click', function(){
      $('.modal-search-header').removeClass('show-modal-search');
      $('.js-show-modal-search').css('opacity','1');
  });
  $('.container-search-header').on('click', function(e){
      e.stopPropagation();
  });
    /*==================================================================
  [ Fixed Header ]*/
  var headerDesktop = $('.container-menu-desktop');
  var wrapMenu = $('.wrap-menu-desktop');
  var posWrapHeader
  if($('.top-bar').length > 0) {
       posWrapHeader = $('.top-bar').height();
  }
  else {
       posWrapHeader = 0;
  }
  if($(window).scrollTop() > posWrapHeader) {
      $(headerDesktop).addClass('fix-menu-desktop');
      $(wrapMenu).css('top',0);
  }
  else {
      $(headerDesktop).removeClass('fix-menu-desktop');
      $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop());
  }
  $(window).on('scroll',function(){
      if($(this).scrollTop() > posWrapHeader) {
          $(headerDesktop).addClass('fix-menu-desktop');
          $(wrapMenu).css('top',0);
      }
      else {
          $(headerDesktop).removeClass('fix-menu-desktop');
          $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop());
      }
  });
  $('.js-show-cart').on('click',function(){
    $('.js-panel-cart').addClass('show-header-cart');
});
$('.js-hide-cart').on('click',function(){
    $('.js-panel-cart').removeClass('show-header-cart');
});
  /*==================================================================
  [ Menu mobile ]*/
  $('.btn-show-menu-mobile').on('click', function(){
      $(this).toggleClass('is-active');
      $('.menu-mobile').slideToggle();
  });
  var arrowMainMenu = $('.arrow-main-menu-m');
  for(var i=0; i<arrowMainMenu.length; i++){
      $(arrowMainMenu[i]).on('click', function(){
          $(this).parent().find('.sub-menu-m').slideToggle();
          $(this).toggleClass('turn-arrow-main-menu-m');
      })
  }
  $(window).resize(function(){
      if($(window).width() >= 992){
          if($('.menu-mobile').css('display') == 'block') {
              $('.menu-mobile').css('display','none');
              $('.btn-show-menu-mobile').toggleClass('is-active');
          }
          $('.sub-menu-m').each(function(){
              if($(this).css('display') == 'block') { console.log('hello');
                  $(this).css('display','none');
                  $(arrowMainMenu).removeClass('turn-arrow-main-menu-m');
              }
          });
      }
  });

  }
  logout() {
    this.authService.logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('idUser');
    localStorage.removeItem('products');
    window.location.href = '/login';
  }
}
