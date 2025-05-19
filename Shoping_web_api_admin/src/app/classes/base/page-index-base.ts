// import { ComponentBase } from './component-base';
// import { MenuItem } from 'primeng/api';
// import { TranslateService } from '@ngx-translate/core';
// import { NotifierService } from '../../services/notifier.service';
// import { Printd } from 'printd';
// import { Injector, ViewChild, ElementRef, HostListener } from '@angular/core';
// import { CommonService } from '../../services/common.service';
// import { Router } from '@angular/router';
// import { VsUserSettingsService } from '../../services/vs-user-settings.service';
// const cssText = `
//   @media print {
//     table{
//       border-collapse: collapse;
//       width: 100%
//     }
//     .hidden{
//         display: block;
//     }
//     tr > th{
//       color:red;
//       text-align: center;
//       font-size:70%;
//     }
//     tr > td{
//     }
//     td, th {
//       border: 1px solid black;
//     }
//     .vs-hidden-print, .ui-paginator-bottom{
//         display:none;
//     }
//   }
// `;

// export abstract class PageIndexBase extends ComponentBase {

//     query = '';
//     openSearchAdv = false;
//     isCheckAll = false;
//     isViewActivity = false;
//     isViewSetting = false;
//     ids = [];
//     total = 0;
//     page = 1;
//     limit = 10;
//     limitAll = 10000;
//     cols = [];
//     isMultiEdit = false;
//     dataSource = [];
//     openSelectCheck = false;
//     sortField = '';
//     orderType = 1;
//     isLoading = false;
//     selectedItems = [];
//     isAsc = true;
//     listCountItemPage = [
//         { label: '10', value: 10 },
//         { label: '50', value: 50 },
//         { label: '100', value: 100 },
//     ];
//     splitExportItems: MenuItem[] = [
//         { label: 'Excel', icon: 'fa fa-file-excel' },
//         { label: 'Word', icon: 'fa fa-file-word' }
//     ];
//     openColumnList = false;

//     @ViewChild('columnListContainer')
//     columnListContainerElement: ElementRef;

//     @ViewChild('bulkSelectContainer')
//     bulkSelectContainerElement: ElementRef;

//     protected _translateService: TranslateService;
//     protected _commonService: CommonService;
//     protected _router: Router;
//     protected _tnUserSettingsService: VsUserSettingsService;
//     constructor(
//         protected _injector: Injector
//     ) {
//         super();
//         this._notifierService = this._injector.get(NotifierService);
//         this._translateService = this._injector.get(TranslateService);
//         this._commonService = this._injector.get(CommonService);
//         this._router = this._injector.get(Router);
//         this._tnUserSettingsService = this._injector.get(VsUserSettingsService);
//     }

//     @HostListener('document:click', ['$event', '$event.target'])
//     onClick(event: MouseEvent, targetElement: HTMLElement) {
//         if (this.columnListContainerElement) {
//             if (!this.columnListContainerElement.nativeElement.contains(targetElement)) {
//                 this.openColumnList = false;
//             }
//         }

//         if (this.bulkSelectContainerElement) {
//             if (!this.bulkSelectContainerElement.nativeElement.contains(targetElement)) {
//                 this.openSelectCheck = false;
//             }
//         }
//     }

//     onLoadSettings() {
//         // this._tnUserSettingsService.getSettingByUrl(environment.clientDomain.idPhanhe, this._router.url).then(rs => {
//         //     if (rs.status) {
//         //         this.mySettings = rs.data;
//         //         this.openSearchAdv = this.mySettings.openSearchAdv;
//         //         if (this.mySettings.cols) {
//         //             this.cols = JSON.parse(this.mySettings.cols);
//         //         }
//         //         if (this.pSetting !== undefined) {
//         //             this.pSetting.onLoadSetting(rs.data);
//         //         }
//         //     }
//         // });
//     }

//     // tslint:disable-next-line:use-life-cycle-interface
//     ngOnDestroy() {
//         this._unsubscribeAll.next();
//         this._unsubscribeAll.complete();
//     }

//     toggleSearch() {
//         this.openSearchAdv = !this.openSearchAdv;
//     }

//     toggleSelectCheck(): void {
//         this.openSelectCheck = !this.openSelectCheck;
//     }

//     getData() {
//         throw new Error('Method not implemented.');
//     }

//     onSearch(): void {
//         this.page = 1;
//         this.getData();
//         // this.openSearchAdv = false;
//     }

//     goToPage(event: any): void {
//         this.page = (event.first / event.rows) + 1;
//         this.limit = event.rows;
//         this.getData();
//     }

//     onNext(): void {
//         this.page++;
//         this.getData();
//     }

//     onPrev(): void {
//         this.page--;
//         this.getData();
//     }

//     onSort(event: any) {
//         this.sortField = event.field;
//         this.orderType = event.order;
//         this.isAsc = event.order === 1 ? true : false;
//         this.getData();
//     }

//     onChangeSize(n: number): void {
//         if (n <= 0) {
//             n = 5;
//         }
//         this.limit = n;
//         this.page = 1;
//         this.getData();
//     }

//     viewActivities(): void {
//         this.isViewActivity = !this.isViewActivity;
//     }

//     viewSettings(): void {
//         this.isViewSetting = !this.isViewSetting;
//     }

//     onPage(event: any): void {
//         this.page = (event.first / event.rows) + 1;
//         this.limit = event.rows;
//         this.getData();
//     }

//     checkItem(item) {
//         if (item.checked) {
//             this.ids.push(item.id);
//             item.checked = true;
//         } else {
//             this.ids.splice(this.ids.indexOf(item.id), 1);
//             item.checked = false;
//         }
//         this.isMultiEdit = this.ids.length > 0 ? true : false;
//         this.isCheckAll = this.ids.length === this.dataSource.length ? true : false;
//     }

//     onCheckAll(ev) {
//         if (ev.target.checked) {
//             this.isCheckAll = true;
//             this.ids = [];
//             for (let i = 0; i < this.dataSource.length; i++) {
//                 this.dataSource[i].checked = true;
//                 this.ids.push(this.dataSource[i].id);
//             }
//         } else {
//             this.isCheckAll = false;
//             this.ids = [];
//             for (let i = 0; i < this.dataSource.length; i++) {
//                 this.dataSource[i].checked = false;
//             }
//         }
//         this.isMultiEdit = this.ids.length > 0 ? true : false;
//     }

//     checkItemMenu(type: number) {
//         this.ids = [];
//         for (let i = 0; i < this.dataSource.length; i++) {
//             if (type === -1) {
//                 this.dataSource[i].checked = true;
//                 this.ids.push(this.dataSource[i].id);
//             } else if (type === -2) {
//                 this.dataSource[i].checked = false;
//             } else {
//                 if (this.dataSource[i].trangThai === type) {
//                     this.dataSource[i].checked = true;
//                     this.ids.push(this.dataSource[i].id);
//                 }
//             }
//         }
//         this.openSelectCheck = false;
//         this.isMultiEdit = this.ids.length > 0 ? true : false;
//         this.isCheckAll = this.ids.length === this.dataSource.length ? true : false;
//     }

//     paginate(event) {
//         this.page = event.page + 1;
//         this.limit = event.rows;
//         this.getData();
//     }

//     onSelectionChanged(event) {
//         this.selectedItems = event;
//     }

//     containSelectItem(item) {
//         return this.selectedItems.findIndex(x => x.id === item.id) > -1;
//     }

//     toggleColumnList() {
//         this.openColumnList = !this.openColumnList;
//     }

//     onPrint() {
//         const d = new Printd();
//         d.print(document.getElementById('table'), [cssText]);
//     }
//     onPrintE(element: string) {
//         const d = new Printd();
//         d.print(document.getElementById(element), [cssText]);
//     }
//     exportToCSV(fileName: string = 'export') {
//         if (this.ids.length === 0) {
//             this._notifierService.showWarning('Bạn chưa chọn dòng để xuất dữ liệu');
//         } else {
//             const data = this.dataSource.filter(x => this.ids.indexOf(x.id) >= 0);
//             this._commonService.exportToCSV(
//                 data,
//                 this.cols,
//                 fileName + '.csv'
//             );
//         }
//     }

//     onSaveSettings(event: any) {
//         // if (event.checkCols === true) {
//         //     this.mySettings.cols = JSON.stringify(this.cols);
//         // } else {
//         //     this.mySettings.cols = undefined;
//         // }
//         // if (event.checkSearch === true) {
//         //     this.mySettings.openSearchAdv = this.openSearchAdv;
//         // }
//         // this._tnUserSettingsService.updateSettingForUrl(this.mySettings).then(rs => {
//         //     if (rs.status) {
//         //         this.mySettings = rs.data;
//         //         if (this.mySettings.cols !== null && this.mySettings.cols !== undefined) {
//         //             this.cols = JSON.parse(this.mySettings.cols);
//         //         }
//         //         this.pSetting.onLoadSetting(this.mySettings);
//         //         this._notifierService.showUpdateDataSuccess();
//         //     } else {
//         //         this._notifierService.showUpdateDataFailed();
//         //     }
//         // });
//     }

// }
