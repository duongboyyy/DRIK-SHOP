// // import { ComponentBase } from './component-base';
// import { MenuItem } from 'primeng/api';
// // import { BaseService } from '../../services/base.service';
// // import { NotifierService } from '../../services/notifier.service';
// import { OnInit, Injector, ViewChild, ElementRef, HostListener } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// // import { CustomRouterService } from '../../services/custom-router.service';
// import { takeUntil } from 'rxjs/operators';
// // import { ListHelperService } from '../../services/list-helper.service';
// // import { TranslateService } from '@ngx-translate/core';
// // import { CommonService } from '../../services/common.service';
// // import { ExportService } from '../../services/export.service';

// // import { Printd } from 'printd';
// // import { VsUserSettingsService } from '../../services/vs-user-settings.service';
// // import { VsMySettingService } from '../../../services/ccmysetting.service';
// // import { VsMySetting } from '../../../models/ccmysetting';
// import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';
// import { DatePipe } from '@angular/common';
// import * as moment from 'moment';
// // import { User } from '../../models/user';

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


// export abstract class SecondPageIndexBase implements OnInit {
//     // currentUser = new User;
//     query = '';
//     openSearchAdv = false;
//     isCheckAll = false;
//     isViewActivity = false;
//     isViewSetting = false;
//     ids = [];
//     total = 0;
//     page = 1;
//     limit = 100;
//     limitAll = 10000;
//     cols = [];
//     isMultiEdit = false;
//     dataSource = [];
//     dataExport = [];
//     dataTotal = [];
//     openSelectCheck = false;
//     sortField = '';
//     isAsc = false;
//     isLoading = false;
//     selectedItems = [];
//     isCollapsed = false;
//     isIgnoreClientCache = false;
//     openColumnList = false;
//     isViewList = true;
//     arrTrangThai = [
//         { label: 'Sử dụng', value: 1 },
//         { label: 'Không Sử dụng', value: 2 },
//         { label: '--Tất cả--', value: 0 },
//     ];
//     trangThai = 1;
//     listItemNumberPerPage = [
//         { label: '20', value: 20 },
//         { label: '50', value: 50 },
//         { label: '100', value: 100 },
//         { label: '200', value: 200 },
//         { label: '500', value: 500 },
//         { label: '1000', value: 1000 },
//     ];
//     exportName = 'dataExport';
//     @ViewChild('columnListContainer')
//     columnListContainerElement: ElementRef;

//     @ViewChild('bulkSelectContainer')
//     bulkSelectContainerElement: ElementRef;

//     protected _activatedRoute: ActivatedRoute;
//     // protected _customRouterService: CustomRouterService;
//     // protected _listHelperService: ListHelperService;
//     // protected _commonService: CommonService;
//     // protected _translateService: TranslateService;
//     // protected _exportService: ExportService;
//     protected _router: Router;
//     // protected _tnUserSettingsService: VsUserSettingsService;
//     // protected _mySettingService: VsMySettingService;
//     // mySetting = new VsMySetting();
//     constructor(
//         // protected _baseService: BaseService,
//         protected _injector: Injector
//     ) {
//         super();
//         this._router = this._injector.get(Router);
//         this._activatedRoute = this._injector.get(ActivatedRoute);
//         this.onLoadSettings();
//         // this._notifierService = this._injector.get(NotifierService);
//         // this._customRouterService = this._injector.get(CustomRouterService);
//         // this._listHelperService = this._injector.get(ListHelperService);
//         // this._commonService = this._injector.get(CommonService);
//         // this._translateService = this._injector.get(TranslateService);
//         // this._exportService = this._injector.get(ExportService);
//         // this._tnUserSettingsService = this._injector.get(VsUserSettingsService);
//         // this._mySettingService = this._injector.get(VsMySettingService);
//         // this.mySetting = this._mySettingService.getCurrentSetting();
//     }

//     splitExportItems: MenuItem[] = [
//         { label: 'Excel', icon: 'fa fa-file-excel' },
//         { label: 'Word', icon: 'fa fa-file-word' }
//     ];

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

//     ngOnInit(): void {
//         this._activatedRoute.fragment
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe((fragments) => {
//                 let query = this._customRouterService.parseFragment(fragments).searchKey;
//                 if (query === null || query === undefined) {
//                     query = '';
//                 }
//                 this.query = query;
//                 this.getData();
//             });
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
//         // this.limit = this._listHelperService.getLimitByScreen();
//         // this._baseService.get(this.query, ((this.page - 1) * this.limit), this.limit, this.sortField, this.isAsc, this.isIgnoreClientCache)
//         //     .then(response => {
//         //         this.dataSource = response.data;

//         //         if (response.totalRecord || response.totalRecord === 0) {
//         //             this.total = response.totalRecord;
//         //         }

//         //         this.afterGetData();

//         //     }, error => {
//         //         this._notifierService.showHttpUnknowError();
//         //     });
//     }

//     exportToCSVIds() {
//         if (this.ids.length === 0) {
//             this._notifierService.showWarning('Bạn chưa chọn dòng để xuất dữ liệu');
//         } else {
//             const data = this.dataSource.filter(x => this.ids.indexOf(x.id) >= 0);
//             this._commonService.exportToCSV(
//                 data,
//                 this.cols,
//                 'export.csv'
//             );
//         }
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
//     exportAllToCSV() {
//         // this._baseService.Gets(this.query, 0, 10000, this.sortField, this.isAsc)
//         //     .then(response => {
//         //         this._commonService.exportToCSV(
//         //             response.data,
//         //             this.cols,
//         //             'export.csv'
//         //         );
//         //     }, error => {
//         //         this._notifierService.showHttpUnknowError();
//         //     });
//     }
//     exportToExcel() {
//         if (this.ids.length === 0) {
//             this._notifierService.showWarning('Bạn chưa chọn dòng để xuất dữ liệu');
//         } else {
//             this._exportService.export(this.ids, this.cols, 'export');
//         }
//     }
//     exportAllToExcel() {
//         // this._baseService.Gets(this.query, 0, this.limitAll, this.sortField, this.isAsc)
//         //     .then(response => {
//         //         if (response.data.length === 0) {
//         //             this._notifierService.showWarning('Không có dữ liệu để xuất !');
//         //         } else {
//         //             this._exportService.export(response.data, this.cols, 'export');
//         //         }
//         //     }, error => {
//         //         this._notifierService.showHttpUnknowError();
//         //     });
//     }

//     // exportPdf() {
//     //     import("jspdf").then(jsPDF => {
//     //         import("jspdf-autotable").then(x => {
//     //             const doc = new jsPDF.default(0,0);
//     //             doc.autoTable(this.exportColumns, this.cars);
//     //             doc.save('primengTable.pdf');
//     //         })
//     //     })
//     // }

//     exportExcel() {
//         const data = [];
//         this.dataSource.forEach(item => {
//             const row = {};
//             this.cols.forEach(col => {
//                 let celValue = item[col.field];
//                 if (celValue) {// Format Date
//                     if (col.dataType === 'date') {
//                         celValue = moment.utc(celValue).format('YYYY-MM-DD HH:mm');
//                     }
//                     if (col.dataType === 'number') {
//                         celValue = (celValue).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
//                     }
//                 }
//                 // if (celValue) {// Format Date
//                 //     if (col.dataType === 'date') {
//                 //         const datePipe = new DatePipe('en-US');
//                 //         celValue = datePipe.transform(celValue, 'yyyy-MM-dd hh:mm');
//                 //     }
//                 //     if (col.dataType === 'number') {

//                 //         celValue = (celValue).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
//                 //     }
//                 // }
//                 row[col.header] = celValue;
//             });
//             data.push(row);
//         });
//         const worksheet = XLSX.utils.json_to_sheet(data);
//         const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
//         const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//         this.saveAsExcelFile(excelBuffer, this.exportName);
//     }

//     saveAsExcelFile(buffer: any, fileName: string): void {
//         let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//         let EXCEL_EXTENSION = '.xlsx';
//         const data: Blob = new Blob([buffer], {
//             type: EXCEL_TYPE
//         });
//         FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
//     }

//     delete(id: number) {
//         this._notifierService.showDeleteConfirm().then(rs => {
//             this._baseService.delete(id)
//                 .then(response => {
//                     this.getData();
//                 }, error => {
//                     this._notifierService.showDeleteDataSuccess();
//                 });
//         });
//     }
//     deletelstMany() {
//         let lstId = '';
//         for (var item of this.ids) {
//             lstId += item.id + ",";
//         }
//         lstId = lstId.substring(0, lstId.length - 1);
//         this._baseService.deleteMany(lstId).then(response => {
//             this.getData();
//         }, error => {
//             this._notifierService.showHttpUnknowError();
//         });
//     }
//     deleteMutiple() {
//         this._notifierService.showDeleteConfirm().then(rs => {

//             // const obs   = new Subject<number>();
//             // let   index = 0;

//             // this.selectedItems.forEach(item => {
//             //     this._baseService.delete(item.id)
//             //         .then(response => {
//             //             obs.next(++index);
//             //             // this._notifierService.showDeleteDataSuccess();
//             //         }, error => {
//             //             obs.next(++index);
//             //             // this._notifierService.showDeleteDataError();
//             //         });
//             // });

//             // const sub = obs.subscribe(indexItem => {
//             //     if (indexItem === this.selectedItems.length) {
//             //         this.selectedItems.length = 0;
//             //         sub.unsubscribe();
//             //         this.getData();
//             //         this._notifierService.showDeleteDataSuccess();
//             //     }
//             // });
//             this.deletelstMany();
//             this._notifierService.showDeleteDataSuccess();
//         });
//     }


//     // deleteMutiple() {
//     //     this._notifierService.showDeleteConfirm().then(rs => {

//     //         const obs   = new Subject<number>();
//     //         let   index = 0;

//     //         this.selectedItems.forEach(item => {
//     //             this._baseService.delete(item.id)
//     //                 .then(response => {
//     //                     obs.next(++index);
//     //                     // this._notifierService.showDeleteDataSuccess();
//     //                 }, error => {
//     //                     obs.next(++index);
//     //                     // this._notifierService.showDeleteDataError();
//     //                 });
//     //         });

//     //         const sub = obs.subscribe(indexItem => {
//     //             if (indexItem === this.selectedItems.length) {
//     //                 this.selectedItems.length = 0;
//     //                 sub.unsubscribe();
//     //                 this.getData();
//     //                 this._notifierService.showDeleteDataSuccess();
//     //             }
//     //         });
//     //     });
//     // }

//     afterGetData() {

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
//         this.isAsc = event.order === 1 ? false : true;
//         this.getData();
//     }

//     onChangeSize(): void {
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

//     onPopupClosed(data) {
//         if (data) {
//             this.getData();
//         }
//     }

//     printListLoaiDiemById(ids: string, data: any[]) {
//         let str = '';
//         const arr = ids.split(',');
//         for (let i = 0; i < arr.length - 1; i++) {
//             const tg = data.filter(item => item.id === +arr[i]);
//             str += tg[0].ma + ', ';
//         }
//         const tgs = data.filter(item => item.id === +arr[arr.length - 1]);
//         str += tgs[0].ma;

//         return str;
//     }

//     convertDataToOptions(options: any[], data: any[], fieldName: string) {
//         if (data.length > 0) {
//             data.map(item =>
//                 options.push({ label: item[fieldName], value: item.id })
//             );
//         }
//     }

//     getFieldById(data: any[], id: number, fieldName: string) {
//         for (const i in data) {
//             const item = data[i];

//             if (item.id === id) {
//                 return item[fieldName];
//             }
//         }

//         return id;
//     }
//     toggleColumnList() {
//         this.openColumnList = !this.openColumnList;
//     }

//     resetBulkSelect() {
//         this.ids = [];
//         this.selectedItems = [];
//         this.isCheckAll = false;
//     }

//     getIndexDataById(id: number) {
//         return this.dataSource.findIndex(i => i.id === id);
//     }

//     getDataById(id: number) {
//         const index = this.dataSource.findIndex(i => i.id === id);
//         return this.dataSource[index];
//     }

//     onPrint() {
//         const d = new Printd();
//         d.print(document.getElementById('table'), [cssText]);
//     }
//     onPrintE(element: string) {
//         const d = new Printd();
//         d.print(document.getElementById(element), [cssText]);
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

//     getMaxDialogHeight() {
//         return (window.innerHeight - 200).toString() + 'px';
//     }

//     onRowSelect(event) {
//         this.ids.push(event.data.id);
//         event.data.checked = true;

//         this.isMultiEdit = this.ids.length > 0 ? true : false;
//         this.isCheckAll = this.ids.length === this.dataSource.length ? true : false;
//     }
//     onRowUnselect(event) {
//         this.ids.splice(this.ids.indexOf(event.data.id), 1);
//         event.data.checked = false;

//         this.isMultiEdit = this.ids.length > 0 ? true : false;
//         this.isCheckAll = this.ids.length === this.dataSource.length ? true : false;
//     }

//     // GetStatus(item: any) {
//     //     if (item.idStatus === 1000) {
//     //         return `<span class="order don-moi">${item.status}</span>`;
//     //     }
//     //     if (item.idStatus === 31 || item.idStatus === 32) {
//     //         return `<span class="order don-thanhcong">${item.status}</span>`;
//     //     }
//     //     if (item.idStatus === 22 || item.idStatus === 33) {
//     //         return `<span class="order don-nguyhiem">${item.status}</span>`;
//     //     }
//     //     if (item.idStatus === 4 || item.idStatus === 40 || item.idStatus === 41 || item.idStatus === 999) {
//     //         return `<span class="order don-thatbai">${item.status}</span>`;
//     //     } else {
//     //         return `<span class="order don-danggiao">${item.status}</span>`;
//     //     }
//     // }

//     formatPhone(phone): string {
//         const re = new RegExp(/^((84|0[3|5|7|8|9])+([0-9]{8})\b)$/);
//         if (re.test(phone)) {
//             phone = phone.substring(0, 4) + '***' + phone.substring(7);
//         }
//         return phone;
//     }
//     onChangeRowLimit() {
//         this.onSearch();
//         this.fixTableScrollProblem();
//     }
//     // fix vụ lệch header ở table khi xuất hiện thanh scroll
//     fixTableScrollProblem() {
//         this.dataSource = [...this.dataSource];
//     }
// }
