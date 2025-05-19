import { ElementRef, HostListener, Injectable, Injector, OnInit, ViewChild } from "@angular/core";
import { ComponentBase } from "./component-base";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomRouterService } from "../../services/custom-router.service";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()

export abstract class SecondPageIndexBase extends ComponentBase implements OnInit {
    query = '';
    openSearchAdv = false;
    isCheckAll = false;
    isViewActivity = false;
    isViewSetting = false;
    dataExport = [];
    ids = [];
    total = 0;
    page = 1;
    limit = 100;
    limitAll = 10000;
    cols = [];
    isMultiEdit = false;
    dataSource = [];
    dataTotal = [];
    openSelectCheck = false;
    sortField = '';
    isAsc = false;
    isLoading = false;
    selectedItems = [];
    isCollapsed = false;
    isIgnoreClientCache = false;
    openColumnList = false;
    isViewList = true;
    arrTrangThai = [
        { label: 'Sử dụng', value: 1 },
        { label: 'Không Sử dụng', value: 2 },
        { label: '--Tất cả--', value: 0 },
    ];
    trangThai = 1;
    listItemNumberPerPage = [
        { label: '2', value: 2 },
        { label: '20', value: 20 },
        { label: '50', value: 50 },
        { label: '100', value: 100 },
        { label: '200', value: 200 },
        { label: '500', value: 500 },
        { label: '1000', value: 1000 },
    ];

    @ViewChild('columnListContainer')
    columnListContainerElement: ElementRef;

    @ViewChild('bulkSelectContainer')
    bulkSelectContainerElement: ElementRef;

    protected _router: Router;
    protected _activatedRoute: ActivatedRoute;
    protected _customRouterService: CustomRouterService;
    
    constructor(
        protected _injector: Injector,
        
    ) {
        super();
        this._router = this._injector.get(Router);
        this._activatedRoute = this._injector.get(ActivatedRoute);
        this._customRouterService = this._injector.get(CustomRouterService);
    }

    @HostListener('document:click', ['$event', '$event.target'])
    onClick(event: MouseEvent, targetElement: HTMLElement) {
        if (this.columnListContainerElement) {
            if (!this.columnListContainerElement.nativeElement.contains(targetElement)) {
                this.openColumnList = false;
            }
        }

        if (this.bulkSelectContainerElement) {
            if (!this.bulkSelectContainerElement.nativeElement.contains(targetElement)) {
                this.openSelectCheck = false;
            }
        }
    }
    claim:any=[];
    ngOnInit(): void {
        this._activatedRoute.fragment
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((fragments) => {
                let query = this._customRouterService.parseFragment(fragments).searchKey;
                if (query === null || query === undefined) {
                    query = '';
                }
                this.query = query;
                this.getData();
            });
    
    }
    checkClaim(value: string): boolean {
        return true;
        //return this.claim.some((c: any) => c.value === value);
    }
    getData() {
        // this.limit = this._listHelperService.getLimitByScreen();
        // this._baseService.get(this.query, ((this.page - 1) * this.limit), this.limit, this.sortField, this.isAsc, this.isIgnoreClientCache)
        //     .then(response => {
        //         this.dataSource = response.data;

        //         if (response.totalRecord || response.totalRecord === 0) {
        //             this.total = response.totalRecord;
        //         }

        //         this.afterGetData();

        //     }, error => {
        //         this._notifierService.showHttpUnknowError();
        //     });
    }
    
    // delete(id: number) {
    //     this._notifierService.showDeleteConfirm().then(rs => {
    //         this._baseService.delete(id)
    //             .then(response => {
    //                 this.getData();
    //             }, error => {
    //                 this._notifierService.showDeleteDataSuccess();
    //             });
    //     });
    // }
    // deletelstMany() {
    //     let lstId = '';
    //     for (var item of this.ids) {
    //         lstId += item.id + ",";
    //     }
    //     lstId = lstId.substring(0, lstId.length - 1);
    //     this._baseService.deleteMany(lstId).then(response => {
    //         this.getData();
    //     }, error => {
    //         this._notifierService.showHttpUnknowError();
    //     });
    // }
    deleteMutiple() {
        this._notifierService.showDeleteConfirm().then(rs => {

            // const obs   = new Subject<number>();
            // let   index = 0;

            // this.selectedItems.forEach(item => {
            //     this._baseService.delete(item.id)
            //         .then(response => {
            //             obs.next(++index);
            //             // this._notifierService.showDeleteDataSuccess();
            //         }, error => {
            //             obs.next(++index);
            //             // this._notifierService.showDeleteDataError();
            //         });
            // });

            // const sub = obs.subscribe(indexItem => {
            //     if (indexItem === this.selectedItems.length) {
            //         this.selectedItems.length = 0;
            //         sub.unsubscribe();
            //         this.getData();
            //         this._notifierService.showDeleteDataSuccess();
            //     }
            // });
            // this.deletelstMany();
            this._notifierService.showDeleteDataSuccess();
        });
    }


    // deleteMutiple() {
    //     this._notifierService.showDeleteConfirm().then(rs => {

    //         const obs   = new Subject<number>();
    //         let   index = 0;

    //         this.selectedItems.forEach(item => {
    //             this._baseService.delete(item.id)
    //                 .then(response => {
    //                     obs.next(++index);
    //                     // this._notifierService.showDeleteDataSuccess();
    //                 }, error => {
    //                     obs.next(++index);
    //                     // this._notifierService.showDeleteDataError();
    //                 });
    //         });

    //         const sub = obs.subscribe(indexItem => {
    //             if (indexItem === this.selectedItems.length) {
    //                 this.selectedItems.length = 0;
    //                 sub.unsubscribe();
    //                 this.getData();
    //                 this._notifierService.showDeleteDataSuccess();
    //             }
    //         });
    //     });
    // }

    afterGetData() {

    }

    onSearch(): void {
        this.page = 1;

        this.getData();
        // this.openSearchAdv = false;
    }

    goToPage(event: any): void {
        this.page = (event.first / event.rows) + 1;
        this.limit = event.rows;
        this.getData();
    }

    onNext(): void {
        this.page++;
        this.getData();
    }

    onPrev(): void {
        this.page--;
        this.getData();
    }

    onSort(event: any) {
        this.sortField = event.field;
        this.isAsc = event.order === 1 ? false : true;
        this.getData();
    }

    onChangeSize(): void {
        this.page = 1;
        this.getData();
    }

    viewActivities(): void {
        this.isViewActivity = !this.isViewActivity;
    }

    viewSettings(): void {
        this.isViewSetting = !this.isViewSetting;
    }

    onPage(event: any): void {
        this.page = (event.first / event.rows) + 1;
        this.limit = event.rows;
        this.getData();
    }

    checkItem(item) {
        if (item.checked) {
            this.ids.push(item.id);
            item.checked = true;
        } else {
            this.ids.splice(this.ids.indexOf(item.id), 1);
            item.checked = false;
        }
        this.isMultiEdit = this.ids.length > 0 ? true : false;
        this.isCheckAll = this.ids.length === this.dataSource.length ? true : false;
    }

    onCheckAll(ev) {
        if (ev.target.checked) {
            this.isCheckAll = true;
            this.ids = [];
            for (let i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].checked = true;
                this.ids.push(this.dataSource[i].id);
            }
        } else {
            this.isCheckAll = false;
            this.ids = [];
            for (let i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].checked = false;
            }
        }
        this.isMultiEdit = this.ids.length > 0 ? true : false;
    }

    checkItemMenu(type: number) {
        this.ids = [];
        for (let i = 0; i < this.dataSource.length; i++) {
            if (type === -1) {
                this.dataSource[i].checked = true;
                this.ids.push(this.dataSource[i].id);
            } else if (type === -2) {
                this.dataSource[i].checked = false;
            } else {
                if (this.dataSource[i].trangThai === type) {
                    this.dataSource[i].checked = true;
                    this.ids.push(this.dataSource[i].id);
                }
            }
        }
        this.openSelectCheck = false;
        this.isMultiEdit = this.ids.length > 0 ? true : false;
        this.isCheckAll = this.ids.length === this.dataSource.length ? true : false;
    }

    paginate(event) {
        this.page = event.page + 1;
        this.limit = event.rows;
        this.getData();
    }

    onSelectionChanged(event) {
        this.selectedItems = event;
    }

    containSelectItem(item) {
        return this.selectedItems.findIndex(x => x.id === item.id) > -1;
    }

    onPopupClosed(data) {
        if (data) {
            this.getData();
        }
    }

    printListLoaiDiemById(ids: string, data: any[]) {
        let str = '';
        const arr = ids.split(',');
        for (let i = 0; i < arr.length - 1; i++) {
            const tg = data.filter(item => item.id === +arr[i]);
            str += tg[0].ma + ', ';
        }
        const tgs = data.filter(item => item.id === +arr[arr.length - 1]);
        str += tgs[0].ma;

        return str;
    }

    convertDataToOptions(options: any[], data: any[], fieldName: string) {
        if (data.length > 0) {
            data.map(item =>
                options.push({ label: item[fieldName], value: item.id })
            );
        }
    }

    getFieldById(data: any[], id: number, fieldName: string) {
        for (const i in data) {
            const item = data[i];

            if (item.id === id) {
                return item[fieldName];
            }
        }

        return id;
    }
    toggleColumnList() {
        this.openColumnList = !this.openColumnList;
    }

    resetBulkSelect() {
        this.ids = [];
        this.selectedItems = [];
        this.isCheckAll = false;
    }

    getIndexDataById(id: number) {
        return this.dataSource.findIndex(i => i.id === id);
    }

    getDataById(id: number) {
        const index = this.dataSource.findIndex(i => i.id === id);
        return this.dataSource[index];
    }

    // onPrint() {
    //     const d = new Printd();
    //     d.print(document.getElementById('table'), [cssText]);
    // }
    // onPrintE(element: string) {
    //     const d = new Printd();
    //     d.print(document.getElementById(element), [cssText]);
    // }

    onSaveSettings(event: any) {
        // if (event.checkCols === true) {
        //     this.mySettings.cols = JSON.stringify(this.cols);
        // } else {
        //     this.mySettings.cols = undefined;
        // }
        // if (event.checkSearch === true) {
        //     this.mySettings.openSearchAdv = this.openSearchAdv;
        // }
        // this._tnUserSettingsService.updateSettingForUrl(this.mySettings).then(rs => {
        //     if (rs.status) {
        //         this.mySettings = rs.data;
        //         if (this.mySettings.cols !== null && this.mySettings.cols !== undefined) {
        //             this.cols = JSON.parse(this.mySettings.cols);
        //         }
        //         this.pSetting.onLoadSetting(this.mySettings);
        //         this._notifierService.showUpdateDataSuccess();
        //     } else {
        //         this._notifierService.showUpdateDataFailed();
        //     }
        // });
    }

    getMaxDialogHeight() {
        return (window.innerHeight - 200).toString() + 'px';
    }

    onRowSelect(event) {
        this.ids.push(event.data.id);
        event.data.checked = true;

        this.isMultiEdit = this.ids.length > 0 ? true : false;
        this.isCheckAll = this.ids.length === this.dataSource.length ? true : false;
    }
    onRowUnselect(event) {
        this.ids.splice(this.ids.indexOf(event.data.id), 1);
        event.data.checked = false;

        this.isMultiEdit = this.ids.length > 0 ? true : false;
        this.isCheckAll = this.ids.length === this.dataSource.length ? true : false;
    }

    // GetStatus(item: any) {
    //     if (item.idStatus === 1000) {
    //         return `<span class="order don-moi">${item.status}</span>`;
    //     }
    //     if (item.idStatus === 31 || item.idStatus === 32) {
    //         return `<span class="order don-thanhcong">${item.status}</span>`;
    //     }
    //     if (item.idStatus === 22 || item.idStatus === 33) {
    //         return `<span class="order don-nguyhiem">${item.status}</span>`;
    //     }
    //     if (item.idStatus === 4 || item.idStatus === 40 || item.idStatus === 41 || item.idStatus === 999) {
    //         return `<span class="order don-thatbai">${item.status}</span>`;
    //     } else {
    //         return `<span class="order don-danggiao">${item.status}</span>`;
    //     }
    // }

    formatPhone(phone): string {
        const re = new RegExp(/^((84|0[3|5|7|8|9])+([0-9]{8})\b)$/);
        if (re.test(phone)) {
            phone = phone.substring(0, 4) + '***' + phone.substring(7);
        }
        return phone;
    }
    onChangeRowLimit() {
        this.onSearch();
        this.fixTableScrollProblem();
    }
    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    fixTableScrollProblem() {
        this.dataSource = [...this.dataSource];
    }

    toggleSearch() {
        this.openSearchAdv = !this.openSearchAdv;
    }

}
