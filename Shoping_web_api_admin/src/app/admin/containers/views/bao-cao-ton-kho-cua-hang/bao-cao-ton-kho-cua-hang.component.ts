import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { StatisticsService } from '../../../../services/statistic.service';

@Component({
    selector: 'app-bao-cao-ton-kho-cua-hang',
    templateUrl: './bao-cao-ton-kho-cua-hang.component.html',
    styleUrls: ['./bao-cao-ton-kho-cua-hang.component.scss'],
})
export class BaoCaoTonKhoCuaHangComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        isAlert: 0,
        idShop: -1,
    };
    shops_options = [];
    trangThai_options = [];
    brands_options = [];
    colFilter: any = {};
    isActive = true;

    constructor(
        protected _injector: Injector,
        private _StatisticsService: StatisticsService,
        
    ) {
        super(_injector);
    }

    async ngOnInit() {
        this.loadTableColumnConfig();
        // await this.loadBrands();
        await this.loadShops();
        await this.getData();
    }

    async loadShops() {

        this.trangThai_options = [{ label: '-- Tình trạng --', value: 0 },
        { label: 'Còn hàng', value: 1 },
        { label: 'Cần nhập', value: 2 }];

        this.shops_options = [];
        // this.shops_options.push({ label: '-- Kho --', value: -1 });
        // await this._ShopsService.GetShort('', -1, -1).then(rs => {
        //     if (rs.status) {
        //         rs.data.forEach(item => {
        //             this.shops_options.push({ label: item.name, value: item.id });
        //         });
        //     }
        // });
    }

    async loadBrands() {
        this.brands_options.push({ label: '-- Nhà cung cấp --', value: -1 });
        // await this._BrandsService.GetShort('', 1, 0, 100).then(rs => {
        //     if (rs.status) {
        //         rs.data.forEach(item => {
        //             this.brands_options.push({ label: item.name, value: item.id });
        //         });
        //     }
        // });
    }

    loadTableColumnConfig() {
        this.cols = [
            // {
            //     field: 'image',
            //     header: 'Ảnh',
            //     visible: true,
            //     align: 'center',
            //     width: '5%',
            //     sort: true,
            // },
            {
                field: 'idSanPhamBienThe',
                header: 'Mã sản phẩm biến thể',
                visible: true,
                sort: true,
                width: '10%',
                filterOptions: this.colFilter.tenSanPham
            },

            {
                field: 'idSanPham',
                header: 'Mã sản phẩm',
                visible: true,
                sort: true,
                width: '10%',
                filterOptions: this.colFilter.tenSanPham
            },

            {
                field: 'tenKho',
                header: 'Kho',
                visible: true,
                sort: true,
                width: '10%',
            },

            {
                field: 'tenSanPham',
                header: 'Tên sản phẩm',
                visible: true,
                sort: true,
                filterOptions: this.colFilter.tenSanPham
            },
           
            {
                field: 'soLuongDaBan',
                header: 'Đã bán',
                visible: true,
                dataType: 'number',
                align: 'right',
                type: 'separator',
                width: '10%',
                sort: true
            },
            {
                field: 'soLuongTon',
                header: 'Tồn kho',
                dataType: 'number',
                visible: true,
                align: 'right',
                type: 'separator',
                width: '10%',
                sort: true
            },
        ];
    }

    initDefaultOption() {
        this.searchModel.key = '';
        this.searchModel.idClient = 0;
    }

    async getData() {
        this.dataSource = [];
        this.isLoading = true;
    
        const idCuaHang = this.searchModel.idCuaHang ?? -1;
        const idNhaCungCap = this.searchModel.idNhaCungCap ?? -1;
    
        // Convert trạng thái từ số => chuỗi
        let trangThai = '';
        if (this.searchModel.isAlert == 2) trangThai = 'cannhap';
        else if (this.searchModel.isAlert == 1) trangThai = 'conhang';
    
        await this._StatisticsService.Report_TonKhoCuaHang(
            this.searchModel.key,
            idCuaHang,
            idNhaCungCap,
            trangThai,
            (this.page - 1) * this.limit,
            this.limit,
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        });
    
        this.resetBulkSelect();
        this.isLoading = false;
    }
    
    

    onSearch() {
        this.getData();
    }

    toggleSearch() {
        super.toggleSearch();
        this.fixTableScrollProblem();
    }

    onChangeRowLimit() {
        this.fixTableScrollProblem();
    }

    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    fixTableScrollProblem() {
        this.dataSource = [...this.dataSource];
    }

    // async refreshOdooStock() {
    //     this.isLoading = true;
    //     await this._syncService.SyncProductStock();
    //     await this.getData();
    //     this.isLoading = false;
    // }


}
