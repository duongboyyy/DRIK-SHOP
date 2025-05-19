import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';

import { navItems, navItemsEmployee } from '../../../_nav';
import { LoginComponent } from '../views/account/login/login.component';
import { UserService } from '../views/account/user.service';
import { ModalService } from '../modal/modal.service';
import { NotificationCheckOutCountResult, NotificationCheckOutResult, NotificationCountResult, NotificationResult } from './notification/notification';
import { NotificationService } from './notification/notification.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  public user: UserIdenity = new UserIdenity();
  public sidebarMinimized = false;
  public navItems = navItems;
  showToast = false;
  fullname: string;
  isExpanded = false;
  errorMessage = '';

  notification: NotificationCountResult;
  messages: Array<NotificationResult>;

  notificationCheckOut: NotificationCheckOutCountResult;
  messagesCheckOut: Array<NotificationCheckOutResult>;

  constructor(
    private notificationService: NotificationService,
    private modalService: ModalService,
    public userService: UserService,
    public router: Router,
    public http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fullname = localStorage.getItem("fullname") || '';
    const quyen = localStorage.getItem('quyen') || '';

    this.navItems = quyen.includes('Admin') ? navItems :
                    quyen.includes('Employee') ? navItemsEmployee : [];

    this.getNotificationCheckOutCount();
    this.getNotificationCount();

    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl('https://localhost:44302/notify')
      .build();

    connection.start()
      .then(() => console.log('SignalR Connected!'))
      .catch(err => console.error(err.toString()));

    connection.on("BroadcastMessage", () => {
      this.getNotificationCount();
      this.getNotificationCheckOutCount();
      this.showOrderToast(); 
    });
  }

  toggleMinimize(e: boolean) {
    this.sidebarMinimized = e;
  }

  
  showOrderToast() {
    console.log('Hiện toast!');
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 10000);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  onSelectedLogout() {
    this.userService.logout();
  }

  getNotificationCount() {
    this.notificationService.getNotificationCount().subscribe(
      notification => this.notification = notification,
      error => this.errorMessage = <any>error
    );
  }

  getNotificationMessage() {
    this.notificationService.getNotificationMessage().subscribe(
      messages => this.messages = messages,
      error => this.errorMessage = <any>error
    );
  }

  deleteNotifications(): void {
    if (confirm(`Are you sure want to delete all notifications?`)) {
      this.notificationService.deleteNotifications().subscribe(
        () => this.closeModal(),
        error => this.errorMessage = <any>error
      );
    }
  }

  getNotificationCheckOutCount() {
    this.notificationService.getNotificationCheckOutCount().subscribe(
      notification => this.notificationCheckOut = notification,
      error => this.errorMessage = <any>error
    );
  }

  getNotificationCheckOutMessage() {
    this.notificationService.getNotificationCheckOutMessage().subscribe(
      messages => this.messagesCheckOut = messages,
      error => this.errorMessage = <any>error
    );
  }

  deleteNotificationCheckOuts(): void {
    if (confirm(`Are you sure want to delete all checkout notifications?`)) {
      this.notificationService.deleteNotificationCheckOuts().subscribe(
        () => this.closeModalCheckOut(),
        error => this.errorMessage = <any>error
      );
    }
  }

  openModal() {
    this.getNotificationMessage();
    this.modalService.open('custom-modal');
  }

  closeModal() {
    this.modalService.close('custom-modal');
  }

  openModalCheckOut() {
    this.getNotificationCheckOutMessage();
    this.modalService.open('custom-modal-checkout');
  }

  closeModalCheckOut() {
    this.modalService.close('custom-modal-checkout');
  }

  routeCheckOut() {
    this.modalService.close('custom-modal-checkout');
    this.modalService.close('custom-modal');
    this.router.navigate(['/hoadons']);
  }
}

export class UserIdenity {
  firstName: string;
  lastName: string;
  imagePath: string;
  email: string;
}
